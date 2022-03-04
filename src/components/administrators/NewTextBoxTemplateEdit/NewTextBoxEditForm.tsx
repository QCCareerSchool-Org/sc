import { FormEventHandler, ReactElement, useEffect, useRef } from 'react';
import { exhaustMap, Observable, Subject, takeUntil } from 'rxjs';

import { State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { NewTextBoxTemplatePayload } from '@/services/administrators';

type SaveFunction = (payload: NewTextBoxTemplatePayload) => Observable<NewTextBoxTemplate>;

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

  const submit$ = useRef(new Subject<NewTextBoxTemplatePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // each time we get a submit, call the save function
    submit$.current.pipe(
      exhaustMap(payload => save(payload)),
      takeUntil(destroy$),
    ).subscribe(); // errors swallowed in inner observable

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ save ]);

  let valid = true;
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    submit$.current.next({
      description: formState.data.description || null,
      points: parseInt(formState.data.points, 10),
      lines: formState.data.lines === '' ? null : parseInt(formState.data.lines, 10),
      order: parseInt(formState.data.order, 10),
      optional: formState.data.optional,
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newTextBoxDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newTextBoxDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newTextBoxDescriptionHelp" />
              <div id="newTextBoxDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxPoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={formState.data.points} type="number" id="newTextBoxPoints" className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} min={0} max={127} aria-describedby="newTextBoxPointsHelp" required />
              <div id="newTextBoxPointsHelp" className="form-text">The maximum mark for the text box</div>
              {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxLines" className="form-label">Lines</label>
              <input onChange={linesChange} value={formState.data.lines} type="number" id="newTextBoxLines" className={`form-control ${formState.validationMessages.lines ? 'is-invalid' : ''}`} min={1} max={127} placeholder="(default)" aria-describedby="newTextBoxLinesHelp" />
              <div id="newTextBoxLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
              {formState.validationMessages.lines && <div className="invalid-feedback">{formState.validationMessages.lines}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newTextBoxOrder" className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} min={0} max={127} required aria-describedby="newTextBoxOrderHelp" />
              <div id="newTextBoxOrderHelp" className="form-text">The order in which the text box should appear</div>
              {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newTextBoxOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newTextBoxOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>Save</button>
              {formState.processingState === 'saving' && <div className="ms-2"><Spinner /></div>}
              {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.saveErrorMessage ? formState.saveErrorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};
