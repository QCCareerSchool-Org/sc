import type { ChangeEventHandler, ReactElement } from 'react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import type { ProcessingState } from './state';
import type { MarkSavePayload } from './useMarkSave';
import { Spinner } from '@/components/Spinner';
import type { NewTextBox } from '@/domain/newTextBox';

type Props = {
  tutorId: number;
  newTextBox: NewTextBox & { state: ProcessingState; errorMessage?: string };
  markSave$: Subject<MarkSavePayload>;
};

const lineHeight = 24;
const padding = 14;

export const TextBox = ({ tutorId, newTextBox, markSave$ }: Props): ReactElement => {
  const [ markFormValue, setMarkFormValue ] = useState(newTextBox.mark);

  const markChange$ = useRef(new Subject<number | null>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    markChange$.current.pipe(
      distinctUntilChanged(),
      debounceTime(600),
      takeUntil(destroy$),
    ).subscribe(mark => {
      markSave$.next({
        type: 'textBox',
        tutorId,
        partId: newTextBox.partId,
        id: newTextBox.textBoxId,
        mark,
      });
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ markSave$, tutorId, newTextBox.textBoxId, newTextBox.partId ]);

  const markChange: ChangeEventHandler<HTMLInputElement> = e => {
    if (e.target.value === '') {
      setMarkFormValue(null);
      markChange$.current.next(null);
    } else {
      const mark = parseInt(e.target.value, 10);
      if (!isNaN(mark)) {
        setMarkFormValue(mark);
        markChange$.current.next(mark);
      }
    }
  };

  const minHeight = (lineHeight * (newTextBox.lines ?? 4)) + padding;
  return (
    <>
      {newTextBox.description && <label className="form-label">{newTextBox.description}</label>}
      <div className="col-12 col-lg-8 textBoxColumn">
        <div className="form-control" style={{ minHeight }}>{newTextBox.text.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => {
          if (i === 0) {
            return <Fragment key={i}>{p}</Fragment>;
          }
          return <Fragment key={i}><br /><br />{p}</Fragment>;
        })}</div>
      </div>
      <div className="col-12 col-lg-8">
        <textarea className="form-control tutorFillable" rows={3} placeholder="Enter your notes here" />
      </div>
      {newTextBox.points > 0 && (
        <div className="col-4 mt-3 mt-lg-0 fw-bold">
          <div className="d-flex align-items-center">
            <div>
              <input onChange={markChange} value={markFormValue ?? ''} type="number" min={0} max={newTextBox.points} step={1} className="form-control mark tutorFillable" /> / {newTextBox.points}
            </div>
            {newTextBox.state === 'saving' && <div className="ms-2"><Spinner size="sm" /></div>}
          </div>
        </div>
      )}
      <style jsx>{`
      .textBoxColumn { margin-bottom: 30px; /* TODO: Change to Bootstrap gutter size if we revert the gutter size back to default */ }
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
    </>
  );
};
