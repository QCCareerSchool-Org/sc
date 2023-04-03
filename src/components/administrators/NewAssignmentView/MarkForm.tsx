import type { ChangeEventHandler, FC } from 'react';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import type { InputForm } from './state';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

type Props = {
  id: string;
  partId: string;
  points: number;
  mark: number | null;
  markOverride: number | null;
  notes: string | null;
  form: InputForm;
  save: (partId: string, id: string, markOverride: number | null) => void;
};

export const MarkForm: FC<Props> = memo(({ id, partId, points, mark, markOverride, notes, form, save }) => {
  const [ markFormValue, setMarkFormValue ] = useState(markOverride); // for the html input

  const immediateMarkOverride = useRef(markOverride); // for sending updates

  const valueChange$ = useRef(new Subject<{ markOverride: number | null }>());

  useWarnIfUnsavedChanges(markOverride !== immediateMarkOverride.current);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    valueChange$.current.pipe(
      debounceTime(600),
      takeUntil(destroy$),
    ).subscribe(({ markOverride: m }) => {
      save(partId, id, m);
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ id, partId, save ]);

  /**
   * Handle changes to the mark input
   *
   * When a change event occurs, we update the state so that the HTML input
   * visually updates, but we also keep track of the latest value in a ref so
   * that the latest value can be used in the notesChange function
   *
   * @param e the change event
   */
  const handleMarkChange: ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.value === '') {
      setMarkFormValue(null);
      immediateMarkOverride.current = null;
      valueChange$.current.next({ markOverride: null });
    } else {
      const m = parseInt(e.target.value, 10);
      if (!isNaN(m)) {
        setMarkFormValue(m);
        immediateMarkOverride.current = m;
        valueChange$.current.next({ markOverride: m });
      }
    }
  };

  return (
    <div className="row markForm">
      <div className="col-12 col-lg-8">
        <small>Tutor's Notes</small>
        <div className="form-control" style={{ minHeight: 102 }}>{notes?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => {
          if (i === 0) {
            return <Fragment key={i}>{p}</Fragment>;
          }
          return <Fragment key={i}><br /><br />{p}</Fragment>;
        })}</div>
      </div>
      {(points > 0 || form.state === 'saving') && (
        <div className="col-lg-4 mt-3 mt-lg-0">
          {/* <div className="d-flex align-items-center"> */}
          {points > 0 && (
            <>
              <small>Tutor's Mark</small>
              <div className="fw-bold text-nowrap d-flex align-items-center">
                <div className="form-control mark" style={{ height: 38 }}>{mark}</div> <span>&nbsp;/ {points}</span>
              </div>
              <small>Mark Override</small>
              <div className="fw-bold text-nowrap">
                <input onChange={handleMarkChange} value={markFormValue ?? ''} type="number" min={0} max={points} step={1} className="form-control mark tutorFillable" /> / {points}
              </div>
            </>
          )}
          {/* {form.state === 'saving' && <div className="ms-2"><Spinner size="sm" /></div>} */}
          {/* </div> */}
        </div>
      )}
      <div className="col-12">
        {form.state === 'idle' && <small>&nbsp;</small>}
        {form.state === 'saving' && <small>Saving...</small>}
        {form.state === 'save error' && <small className="text-danger">{form.errorMessage ?? 'Error saving'}</small>}
      </div>
      <style jsx>{`
      .markForm { margin-top: 30px; /* TODO: Change to Bootstrap gutter size if we revert the gutter size back to default */ }
      .tutorFillable { background-color: #fcf8d4 }
      .mark { display: inline-block; width: 70px; text-align: center }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      input[type=number] {
        -moz-appearance: textfield;
      }
      `}</style>
    </div>
  );
});

MarkForm.displayName = 'MarkForm';
