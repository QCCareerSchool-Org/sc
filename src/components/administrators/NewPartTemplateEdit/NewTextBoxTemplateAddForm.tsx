import { ChangeEventHandler, FormEventHandler, memo, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewTextBoxTemplatePayload } from '@/services/administrators/newTextBoxTemplateService';

type Props = {
  formState: State['newTextBoxTemplateForm'];
  insert$: Subject<{ processingState: State['newTextBoxTemplateForm']['processingState']; payload: NewTextBoxTemplatePayload }>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  linesChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxTemplateAddForm = memo(({ formState, insert$, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newTextBoxTemplateForm']['validationMessages'];
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
      processingState: formState.processingState,
      payload: {
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines ? parseInt(formState.data.lines, 10) : null,
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <>
      <div id="newTextBoxCard" className="card">
        <div className="card-body">
          <h3 className="h5">New Text Box Template</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newTextBoxTemplateDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newTextBoxTemplateDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newTextBoxTemplateDescriptionHelp" />
              <div id="newTextBoxTemplateDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxTemplatePoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={formState.data.points} type="number" id="newTextBoxTemplatePoints" min={0} max={127} className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} aria-describedby="newTextBoxTemplatePointsHelp" required />
              <div id="newTextBoxTemplatePointsHelp" className="form-text">The maximum mark for the text box</div>
              {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxTemplateLines" className="form-label">Lines</label>
              <input onChange={linesChange} value={formState.data.lines} type="number" id="newTextBoxTemplateLines" min={1} max={127} className={`form-control ${formState.validationMessages.lines ? 'is-invalid' : ''}`} placeholder="(default)" aria-describedby="newTextBoxTemplateLinesHelp" />
              <div id="newTextBoxTemplateLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
              {formState.validationMessages.lines && <div className="invalid-feedback">{formState.validationMessages.lines}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxTemplateOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newTextBoxTemplateOrder" min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby="newTextBoxTemplateOrderHelp" />
              <div id="newTextBoxTemplateOrderHelp" className="form-text">The order in which the text box should appear within its part</div>
              {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newTextBoxTemplateOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newTextBoxTemplateOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
                {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
              </button>
              {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
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
});

NewTextBoxTemplateAddForm.displayName = 'NewTextBoxTemplateAddForm';
