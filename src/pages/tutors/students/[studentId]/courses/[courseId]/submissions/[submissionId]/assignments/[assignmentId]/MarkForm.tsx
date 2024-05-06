import type { ChangeEventHandler, FC } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import type { InputForm } from './state';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

type Props = {
  id: string;
  partId: string;
  points: number;
  mark: number | null;
  notes: string | null;
  form: InputForm;
  save: (partId: string, id: string, mark: number | null, notes: string | null) => void;
  submissionClosed: boolean;
  submissionIsRedo: boolean;
  modified: boolean;
};

export const MarkForm: FC<Props> = memo(({ id, partId, points, mark, notes, form, save, submissionClosed, submissionIsRedo, modified }) => {
  const [ markFormValue, setMarkFormValue ] = useState(mark); // for the html input
  const [ notesFormValue, setNotesFormValue ] = useState(notes); // for the html input

  const immediateMark = useRef(mark); // for sending updates
  const immediateNotes = useRef(notes); // for sending updates

  const valueChange$ = useRef(new Subject<{ mark: number | null; notes: string | null }>());

  useWarnIfUnsavedChanges(mark !== immediateMark.current || notes !== immediateNotes.current);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    valueChange$.current.pipe(
      debounceTime(600),
      takeUntil(destroy$),
    ).subscribe(({ mark: m, notes: n }) => {
      save(partId, id, m, n);
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
      immediateMark.current = null;
      valueChange$.current.next({ mark: null, notes: immediateNotes.current });
    } else {
      const m = parseInt(e.target.value, 10);
      if (!isNaN(m)) {
        setMarkFormValue(m);
        immediateMark.current = m;
        valueChange$.current.next({ mark: m, notes: immediateNotes.current });
      }
    }
  };

  /**
   * Handle changes to the notes input
   *
   * When a change event occurs, we update the state so that the HTML input
   * visually updates, but we also keep track of the latest value in a ref so
   * that the latest value can be used in the markChange function
   *
   * @param e the change event
   */
  const handleNotesChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    if (e.target.value === '') {
      setNotesFormValue(null);
      immediateNotes.current = null;
      valueChange$.current.next({ mark: immediateMark.current, notes: null });
    } else {
      const n = e.target.value;
      setNotesFormValue(n);
      immediateNotes.current = n;
      valueChange$.current.next({ mark: immediateMark.current, notes: n });
    }
  };

  return (
    <div className="row markForm">
      <div className="col-12 col-lg-8">
        {submissionClosed || !modified
          ? <div className="form-control" style={{ minHeight: 120 }}>{notesFormValue}</div>
          : (
            <>
              <textarea onChange={handleNotesChange} value={notesFormValue ?? ''} className="form-control tutorFillable" rows={3} placeholder="Enter your notes here" />
              {submissionIsRedo && modified && <p className="fw-bold text-danger">(REGRADE)</p>}
            </>
          )
        }
      </div>
      {(points > 0 || form.state === 'saving') && (
        <div className="col-lg-4 mt-3 mt-lg-0">
          {points > 0 && (
            <div className="fw-bold text-nowrap">
              {submissionClosed || !modified
                ? <div className="form-control mark">{markFormValue}</div>
                : <input onChange={handleMarkChange} value={markFormValue ?? ''} type="number" min={0} max={points} step={1} className="form-control mark tutorFillable" />
              } / {points}
            </div>
          )}
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
