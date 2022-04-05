import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import { NewPartTemplateFormElements } from '../NewPartTemplateEdit/NewPartTemplateFormElements';
import type { State } from './state';
import type { PartInsertPayload } from './usePartInsert';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  formState: State['newPartTemplateForm'];
  insert$: Subject<PartInsertPayload>;
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  descriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  markingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  partNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateAddForm = memo((props: Props): ReactElement => {
  const { administratorId, schoolId, courseId, unitId, assignmentId, formState, insert$ } = props;

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
      administratorId,
      schoolId,
      courseId,
      unitId,
      assignmentId,
      processingState: formState.processingState,
      payload: {
        partNumber: parseInt(formState.data.partNumber, 10),
        title: formState.data.title,
        description: formState.data.description.length === 0 ? null : formState.data.descriptionType === 'text' ? formState.data.description : formState.meta.sanitizedHtml,
        descriptionType: formState.data.descriptionType,
        markingCriteria: formState.data.markingCriteria || null,
      },
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="h5">New Part Template</h3>
        <form onSubmit={formSubmit}>
          <NewPartTemplateFormElements
            formData={formState.data}
            formValidationMessages={formState.validationMessages}
            titleChange={props.titleChange}
            descriptionChange={props.descriptionChange}
            descriptionTypeChange={props.descriptionTypeChange}
            markingCriteriaChange={props.markingCriteriaChange}
            partNumberChange={props.partNumberChange}
          />
          {/* <div className="formGroup">
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
            </div> */}
          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
              {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
            </button>
            {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
          </div>
        </form>
      </div>
    </div>
  );
});

NewPartTemplateAddForm.displayName = 'NewPartTemplateAddForm';
