import { FormEventHandler, memo, MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentTemplateWithParts } from '@/services/administrators';
import { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';

type Props = {
  assignmentTemplate: NewAssignmentTemplateWithParts;
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewAssignmentTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
  titleChange: FormEventHandler<HTMLInputElement>;
  descriptionChange: FormEventHandler<HTMLTextAreaElement>;
  assignmentNumberChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewAssignmentEditForm = memo(({ assignmentTemplate, formState, save$, delete$, titleChange, descriptionChange, assignmentNumberChange, optionalChange }: Props): ReactElement => {
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
        title: formState.data.title || null,
        description: formState.data.description || null,
        assignmentNumber: parseInt(formState.data.assignmentNumber, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm(`Are you sure you want to delete this assignment template and all its parts?\n\nparts: ${assignmentTemplate?.parts.length}`)) {
      delete$.next(formState.processingState);
    }
  };

  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="formGroup">
          <label htmlFor="newAssignmentTitle" className="form-label">Title</label>
          <input onChange={titleChange} value={formState.data.title} type="text" id="newAssignment" maxLength={191} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentTitleHelp" />
          <div id="newAssignmentTitleHelp" className="form-text">The title of this part (for internal use only)</div>
          {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newAssignmentDescription" className="form-label">Description</label>
          <textarea onChange={descriptionChange} value={formState.data.description} id="newAssignmentDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentDescriptionHelp" />
          <div id="newAssignmentDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
          {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newAssignmentAssignmentNumber" className="form-label">Assignment Number <span className="text-danger">*</span></label>
          <input onChange={assignmentNumberChange} value={formState.data.assignmentNumber} type="number" id="newAssignmentAssignmentNumber" min={1} max={127} className={`form-control ${formState.validationMessages.assignmentNumber ? 'is-invalid' : ''}`} aria-describedby="newAssignmentAssignmentNumberHelp" required />
          <div id="newAssignmentAssignmentNumberHelp" className="form-text">The ordering for this assignment within its unit</div>
          {formState.validationMessages.assignmentNumber && <div className="invalid-feedback">{formState.validationMessages.assignmentNumber}</div>}
        </div>
        <div className="formGroup">
          <div className="form-check">
            <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newAssignmentOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
            <label htmlFor="newAssignmentOptional" className="form-check-label">Optional</label>
            {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
          </button>
          <button type="button" onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
          </button>
          {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
          {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
        </div>
      </form>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
});

NewAssignmentEditForm.displayName = 'NewAssignmentEditForm';
