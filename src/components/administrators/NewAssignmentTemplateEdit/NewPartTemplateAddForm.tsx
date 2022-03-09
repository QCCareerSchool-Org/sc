import { ChangeEventHandler, FormEventHandler, memo, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewPartTemplatePayload } from '@/services/administrators/newPartTemplateService';

type Props = {
  formState: State['partForm'];
  insert$: Subject<{ processingState: State['partForm']['processingState']; payload: NewPartTemplatePayload }>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  partNumberChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateAddForm = memo(({ formState, insert$, titleChange, descriptionChange, partNumberChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['partForm']['validationMessages'];
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
        title: formState.data.title,
        description: formState.data.description || null,
        partNumber: parseInt(formState.data.partNumber, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="h5">New Part Template</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newPartTemplateTitle" className="form-label">Title <span className="text-danger">*</span></label>
              <input onChange={titleChange} value={formState.data.title} type="text" id="newPartTemplateTitle" maxLength={191} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} aria-describedby="newPartTemplateTitleHelp" />
              <div id="newPartTemplateTitleHelp" className="form-text">The title of this part (for internal use only)</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartTemplateDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newPartTemplateDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newPartTemplateDescriptionHelp" />
              <div id="newPartTemplateDescriptionHelp" className="form-text">The description of this part</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartTemplatePartNumber" className="form-label">Part Number <span className="text-danger">*</span></label>
              <input onChange={partNumberChange} value={formState.data.partNumber} type="number" id="newPartTemplatePartNumber" min={1} max={127} className={`form-control ${formState.validationMessages.partNumber ? 'is-invalid' : ''}`} aria-describedby="newPartTemplatePartNumberHelp" required />
              <div id="newPartTemplatePartNumberHelp" className="form-text">The ordering for this part within its assignment (must be unique)</div>
              {formState.validationMessages.partNumber && <div className="invalid-feedback">{formState.validationMessages.partNumber}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newPartTemplateOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newPartTemplateOptional" className="form-check-label">Optional</label>
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

NewPartTemplateAddForm.displayName = 'NewPartTemplateAddForm';
