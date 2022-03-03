import { FormEventHandler, ReactElement, useEffect, useRef } from 'react';
import { exhaustMap, Observable, Subject, takeUntil } from 'rxjs';

import { State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { NewTextBoxPayload } from '@/services/administrators';

type SaveFunction = (payload: NewTextBoxPayload) => Observable<NewTextBoxTemplate>;

type Props = {
  formState: State['form'];
  save: SaveFunction;
  descriptionChange: FormEventHandler<HTMLTextAreaElement>;
  pointsChange: FormEventHandler<HTMLInputElement>;
  linesChange: FormEventHandler<HTMLInputElement>;
  orderChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewTextBoxEditForm = ({ formState, save, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {

  const submit$ = useRef(new Subject<NewTextBoxPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // each time we get a submit, call the save function
    submit$.current.pipe(
      exhaustMap(payload => save(payload)),
      takeUntil(destroy$),
    ).subscribe(); // errors swallowed in inner observable

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ save ]);

  const valid = !isNaN(formState.data.points)
    && formState.data.points >= 1
    && (formState.data.lines === '' || !isNaN(parseInt(formState.data.lines, 10)))
    && !isNaN(formState.data.order)
    && formState.data.order >= 0;

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    submit$.current.next({
      description: formState.data.description || null,
      points: formState.data.points,
      lines: formState.data.lines === '' ? null : parseInt(formState.data.lines, 10),
      order: formState.data.order,
      optional: formState.data.optional,
    });
  };

  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="formGroup">
          <label htmlFor="newTextBoxDescription" className="form-label">Description</label>
          <textarea onChange={descriptionChange} value={formState.data.description} id="newTextBoxDescription" rows={5} className="form-control" placeholder="(none)" aria-describedby="newTextBoxDescriptionHelp" />
          <div id="newTextBoxDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxPoints" className="form-label">Points <span className="text-danger">*</span></label>
          <input onChange={pointsChange} value={formState.data.points} type="number" id="newTextBoxPoints" className="form-control" min={1} aria-describedby="newTextBoxPointsHelp" required />
          <div id="newTextBoxPointsHelp" className="form-text">The maximum mark for the text box</div>
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxLines" className="form-label">Lines</label>
          <input onChange={linesChange} value={formState.data.lines} type="number" id="newTextBoxLines" className="form-control" min={1} placeholder="(default)" aria-describedby="newTextBoxLinesHelp" />
          <div id="newTextBoxLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxOrder" className="form-label">Order</label>
          <input onChange={orderChange} value={formState.data.order} type="number" id="newTextBoxOrder" className="form-control" min={0} required aria-describedby="newTextBoxOrderHelp" />
          <div id="newTextBoxOrderHelp" className="form-text">The order in which the text box should appear</div>
        </div>
        <div className="formGroup">
          <div className="form-check">
            <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newTextBoxOptional" className="form-check-input" />
            <label htmlFor="newTextBoxOptional" className="form-check-label">Optional</label>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary" disabled={!valid || formState.saveState === 'processing'}>Save</button>
          {formState.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
          {formState.saveState === 'error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
        </div>
      </form>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};
