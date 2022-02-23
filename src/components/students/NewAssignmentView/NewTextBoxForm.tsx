import { MouseEventHandler, ReactElement, ReactEventHandler, useEffect, useRef } from 'react';
import { debounceTime, exhaustMap, Subject, switchMap, takeUntil } from 'rxjs';

import { TextBoxFunction } from '.';
import { TextBoxState } from '@/components/students/NewAssignmentView/state';

type Props = {
  textBox: TextBoxState;
  update: TextBoxFunction;
  save: TextBoxFunction;
};

/** amount of time to wait between calling save */
const saveDelay = 1000;

const maxLength = 65_535;

export const NewTextBoxForm = ({ textBox, update, save }: Props): ReactElement => {
  const textChange$ = useRef(new Subject<string>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // send all the changes to the update function
    textChange$.current.pipe(
      exhaustMap(text => update(textBox.partId, textBox.textBoxId, text)),
      takeUntil(destroy$),
    ).subscribe({
      next: () => { /* empty */ },
      error: () => { /* empty */ },
    });

    // send the changes to the save function after a delay
    textChange$.current.pipe(
      debounceTime(saveDelay),
      // throttleTime(saveDelay),
      // we can switch to the latest observable for saving
      switchMap(text => save(textBox.partId, textBox.textBoxId, text)),
      takeUntil(destroy$),
    ).subscribe({
      next: () => { /* empty */ },
      error: () => { /* empty */ },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ save, update, textBox.partId, textBox.textBoxId ]);

  const characters = (new TextEncoder().encode(textBox.text).length);

  const onChange: ReactEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    const newLength = (new TextEncoder().encode(target.value).length);
    if (newLength <= maxLength) {
      textChange$.current.next(target.value);
    }
  };

  const retrySave: MouseEventHandler<HTMLAnchorElement> = (e): void => {
    e.preventDefault();
    textChange$.current.next(textBox.text);
  };

  return (
    <>
      <div className="textBox">
        {textBox.description && <label htmlFor={textBox.textBoxId}>{textBox.description}</label>}
        <textarea maxLength={maxLength} onChange={onChange} value={textBox.text} id={textBox.textBoxId} className="form-control" rows={textBox.lines ?? 7} />
        <div className="row">
          <div className="col">
            {textBox.formState === 'dirty' && (
              <small className="me-1">
                {textBox.saveState === 'saving'
                  ? (
                    <span>saving <div className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /></span>
                  )
                  : (
                    <>
                      {textBox.savedText === textBox.text ? 'saved' : 'unsaved'}{textBox.saveState === 'error' && (
                        <span className="text-danger"> (error saving <a href="#" onClick={retrySave} className="link-primary">retry</a>)</span>
                      )}
                    </>
                  )}
              </small>
            )}
            {textBox.optional && <small className="text-danger">optional</small>}
          </div>
          <div className="col text-end">
            <small>{characters} / {maxLength}</small>
          </div>
        </div>
      </div>
      <style jsx>{`
      .textBox {
        margin-bottom: 1rem;
      }
      .textBox:last-of-type {
        margin-bottom: 0;
      }
      `}</style>
    </>
  );
};
