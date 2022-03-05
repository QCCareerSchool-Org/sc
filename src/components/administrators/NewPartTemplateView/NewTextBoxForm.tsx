import type { FormEventHandler, ReactElement } from 'react';

import type { Subject } from 'rxjs';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewTextBoxTemplatePayload } from '@/services/administrators';

type Props = {
  formState: State['textBoxForm'];
  insert$: Subject<NewTextBoxTemplatePayload>;
  descriptionChange: FormEventHandler<HTMLTextAreaElement>;
  pointsChange: FormEventHandler<HTMLInputElement>;
  linesChange: FormEventHandler<HTMLInputElement>;
  orderChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewTextBoxForm = ({ formState, insert$, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['textBoxForm']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      description: formState.data.description || null,
      points: parseInt(formState.data.points, 10),
      lines: formState.data.lines ? parseInt(formState.data.lines, 10) : null,
      order: parseInt(formState.data.order, 10),
      optional: formState.data.optional,
    });
  };

  return (
    <>
      <div id="newTextBoxCard" className="card">
        <div className="card-body">
          <h3 className="h5">New Text Box</h3>
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
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.saveState === 'processing'}>Add New Text Box</button>
              {formState.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {formState.saveState === 'error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
        .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
