import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewPartTemplatePayload } from '@/services/administrators/newPartTemplateService';

type Props = {
  formState: State['newPartTemplateForm'];
  insert$: Subject<{ processingState: State['newPartTemplateForm']['processingState']; payload: NewPartTemplatePayload }>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  descriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  partNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateAddForm = memo(({ formState, insert$, titleChange, descriptionChange, descriptionTypeChange, partNumberChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newPartTemplateForm']['validationMessages'];
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
    if (formState.data.descriptionType !== 'text' && formState.data.descriptionType !== 'html') {
      throw Error('Invalid description type');
    }
    insert$.next({
      processingState: formState.processingState,
      payload: {
        title: formState.data.title,
        description: formState.data.description || null,
        descriptionType: formState.data.descriptionType,
        partNumber: parseInt(formState.data.partNumber, 10),
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
              <input onChange={titleChange} value={formState.data.title} type="text" id="newPartTemplateTitle" maxLength={191} className={`form-control ${formState.validationMessages.title ? 'is-invalid' : ''}`} aria-describedby="newPartTemplateTitleHelp" required />
              <div id="newPartTemplateTitleHelp" className="form-text">The title of this part (for internal use only)</div>
              {formState.validationMessages.title && <div className="invalid-feedback">{formState.validationMessages.title}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartTemplateDescription" className="form-label">Description</label>
              <div className="row gx-3 align-items-center">
                <div className="col-auto">
                  <div className="form-check">
                    <input onChange={descriptionTypeChange} checked={formState.data.descriptionType === 'text'} className="form-check-input" type="radio" name="descriptionType" value="text" id="newPartTemplateDescriptionTypeText" />
                    <label className="form-check-label" htmlFor="newPartTemplateDescriptionTypeText">Text</label>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="form-check">
                    <input onChange={descriptionTypeChange} checked={formState.data.descriptionType === 'html'} className="form-check-input" type="radio" name="descriptionType" value="html" id="newPartTemplateDescriptionTypeHtml" />
                    <label className="form-check-label" htmlFor="newPartTemplateDescriptionTypeHtml">HTML</label>
                  </div>
                </div>
              </div>
              <textarea onChange={descriptionChange} value={formState.data.description} id="newPartTemplateDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newPartTemplateDescriptionHelp" />
              <div id="newPartTemplateDescriptionHelp" className="form-text">The description of this part{formState.data.descriptionType === 'text' ? <span className="fw-bold"> (Two <em>ENTER</em> keys in a row will start a new paragraph)</span> : formState.data.descriptionType === 'html' ? <span className="fw-bold"> (HTML descriptions should use &lt;p&gt; tags)</span> : null}</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newPartTemplatePartNumber" className="form-label">Part Number <span className="text-danger">*</span></label>
              <input onChange={partNumberChange} value={formState.data.partNumber} type="number" id="newPartTemplatePartNumber" min={1} max={127} className={`form-control ${formState.validationMessages.partNumber ? 'is-invalid' : ''}`} aria-describedby="newPartTemplatePartNumberHelp" required />
              <div id="newPartTemplatePartNumberHelp" className="form-text">The ordering for this part within its assignment (must be unique)</div>
              {formState.validationMessages.partNumber && <div className="invalid-feedback">{formState.validationMessages.partNumber}</div>}
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
