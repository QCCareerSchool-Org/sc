import type { ChangeEventHandler, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewTextBoxTemplatePayload } from '@/services/administrators/newTextBoxTemplateService';

type Props = {
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewTextBoxTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  linesChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxEditForm = memo(({ formState, save$, delete$, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
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
    save$.next({
      processingState: formState.processingState,
      payload: {
        description: formState.data.description || null,
        points: parseInt(formState.data.points, 10),
        lines: formState.data.lines === '' ? null : parseInt(formState.data.lines, 10),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.next(formState.processingState);
    }
  };

  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="formGroup">
          <label htmlFor="newTextBoxDescription" className="form-label">Description</label>
          <textarea onChange={descriptionChange} value={formState.data.description} id="newTextBoxDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newTextBoxDescriptionHelp" />
          <div id="newTextBoxDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
          {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxPoints" className="form-label">Points <span className="text-danger">*</span></label>
          <input onChange={pointsChange} value={formState.data.points} type="number" id="newTextBoxPoints" min={0} max={127} className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} aria-describedby="newTextBoxPointsHelp" required />
          <div id="newTextBoxPointsHelp" className="form-text">The maximum mark for the text box</div>
          {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxLines" className="form-label">Lines</label>
          <input onChange={linesChange} value={formState.data.lines} type="number" id="newTextBoxLines" min={1} max={127} className={`form-control ${formState.validationMessages.lines ? 'is-invalid' : ''}`} placeholder="(default)" aria-describedby="newTextBoxLinesHelp" />
          <div id="newTextBoxLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
          {formState.validationMessages.lines && <div className="invalid-feedback">{formState.validationMessages.lines}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newTextBoxOrder" className="form-label">Order <span className="text-danger">*</span></label>
          <input onChange={orderChange} value={formState.data.order} type="number" id="newTextBoxOrder" min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required aria-describedby="newTextBoxOrderHelp" />
          <div id="newTextBoxOrderHelp" className="form-text">The order in which the text box should appear within its part</div>
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
          <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
          </button>
          <button onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
          </button>
          {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
          {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
        </div>
      </form>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
        .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
});

NewTextBoxEditForm.displayName = 'NewTextBoxEditForm';
