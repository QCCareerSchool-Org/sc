import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { memo, useEffect, useRef } from 'react';
import { debounceTime, exhaustMap, Subject, takeUntil } from 'rxjs';

import type { TextBoxFunction } from './NewAssignmentView';
import type { TextBoxState } from './state';
import { Spinner } from '@/components/Spinner';

type Props = {
  textBox: TextBoxState;
  locked: boolean;
  update: TextBoxFunction;
  save: TextBoxFunction;
};

/** amount of time to wait between calling save */
const saveDelay = 1000;

const maxLength = 65_535;

export const NewTextBoxForm: FC<Props> = memo(({ textBox, locked, update, save }) => {
  const textChange$ = useRef(new Subject<string>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // send all the changes to the update function
    textChange$.current.pipe(
      exhaustMap(text => update(textBox.partId, textBox.textBoxId, text)),
      takeUntil(destroy$),
    ).subscribe(); // errors swallowed in inner observable

    // send the changes to the save function after a delay
    textChange$.current.pipe(
      debounceTime(saveDelay),
      exhaustMap(text => save(textBox.partId, textBox.textBoxId, text)),
      takeUntil(destroy$),
    ).subscribe(); // errors swallowed in inner observable

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ save, update, textBox.partId, textBox.textBoxId ]);

  const characters = [ ...textBox.text ].length;

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    const newLength = [ ...e.target.value ].length;
    if (newLength <= maxLength) {
      textChange$.current.next(e.target.value);
    }
  };

  const handleRetryClick: MouseEventHandler<HTMLAnchorElement> = (e): void => {
    e.preventDefault();
    textChange$.current.next(textBox.text);
  };

  return (
    <>
      <div className="textBox">
        {textBox.description && <label htmlFor={textBox.textBoxId} className="form-label fw-bold">{textBox.description}</label>}
        <textarea maxLength={maxLength} onChange={handleTextareaChange} value={textBox.text} id={textBox.textBoxId} className="form-control" rows={textBox.lines ?? 7} readOnly={locked} />
        <div className="row">
          <div className="col">
            {textBox.formState === 'dirty' && (
              <small className="me-1">
                {textBox.saveState === 'saving'
                  ? <span>saving <Spinner size="sm" height={12} /></span>
                  : (
                    <>
                      {textBox.savedText === textBox.text ? 'saved' : 'unsaved'}{textBox.saveState === 'error' && (
                        <span className="text-danger"> (error saving <a href="#" onClick={handleRetryClick} className="link-primary">retry</a>)</span>
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
});

NewTextBoxForm.displayName = 'NewTextBoxForm';
