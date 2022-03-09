import { ChangeEventHandler, FormEventHandler, memo, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';

type Props = {
  formState: State['assignmentForm'];
  insert$: Subject<{ processingState: State['assignmentForm']['processingState']; payload: NewAssignmentTemplatePayload }>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  assignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateAddForm = memo(({ formState, insert$, titleChange, descriptionChange, assignmentNumberChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['assignmentForm']['validationMessages'];
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
    insert$.next({
      processingState: formState.processingState,
      payload: {
        title: formState.data.title || null,
        description: formState.data.description || null,
        assignmentNumber: parseInt(formState.data.assignmentNumber, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="h5">New Assignment Template</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newAssignmentTemplateTitle" className="form-label">Title</label>
              <input onChange={titleChange} value={formState.data.title} type="text" id="newAssignmentTemplateTitle" maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentTemplateTitleHelp" />
              <div id="newAssignmentTemplateTitleHelp" className="form-text">The title of this assignment</div>
              {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newAssignmentTemplateDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newAssignmentTemplateDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newAssignmentTemplateDescriptionHelp" />
              <div id="newAssignmentTemplateDescriptionHelp" className="form-text">A description of this assignment</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newAssignmentTemplateAssignmentNumber" className="form-label">Assignment Number <span className="text-danger">*</span></label>
              <input onChange={assignmentNumberChange} value={formState.data.assignmentNumber} type="number" id="newAssignmentTemplateAssignmentNumber" min={1} max={127} className={`form-control ${formState.validationMessages.assignmentNumber ? 'is-invalid' : ''}`} aria-describedby="newAssignmentTemplateAssignmentNumberHelp" required />
              <div id="newAssignmentTemplateAssignmentNumberHelp" className="form-text">The ordering for this assignment within its unit (must be unique)</div>
              {formState.validationMessages.assignmentNumber && <div className="invalid-feedback">{formState.validationMessages.assignmentNumber}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newAssignmentTemplateOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newAssignmentTemplateOptional" className="form-check-label">Optional</label>
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

NewAssignmentTemplateAddForm.displayName = 'NewAssignmentTemplateAddForm';
