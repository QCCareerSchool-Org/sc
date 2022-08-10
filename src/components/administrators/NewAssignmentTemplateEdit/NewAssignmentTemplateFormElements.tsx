import type { ChangeEventHandler, ReactElement } from 'react';
import { useId } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onAssignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateFormElements = (props: Props): ReactElement => {
  const { formData, formValidationMessages } = props;

  const id = useId();

  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateTitle'} className="form-label">Title</label>
        <input onChange={props.onTitleChange} value={formData.title} type="text" id={id + '_newAssignmentTemplateTitle'} maxLength={191} className={`form-control ${formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentTemplateTitleHelp'} />
        <div id={id + '_newAssignmentTemplateTitleHelp'} className="form-text">The title of this assignment</div>
        {formValidationMessages.title && <div className="invalid-feedback">{formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateDescription'} className="form-label">Description</label>
        <div className="row gx-3 align-items-center">
          <div className="col-auto">
            <div className="form-check">
              <input onChange={props.onDescriptionTypeChange} checked={formData.descriptionType === 'text'} className="form-check-input" type="radio" name="descriptionType" value="text" id={id + '_newAssignmentTemplateDescriptionTypeText'} />
              <label className="form-check-label" htmlFor={id + '_newAssignmentTemplateDescriptionTypeText'}>Text</label>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-check">
              <input onChange={props.onDescriptionTypeChange} checked={formData.descriptionType === 'html'} className="form-check-input" type="radio" name="descriptionType" value="html" id={id + '_newAssignmentTemplateDescriptionTypeHtml'} />
              <label className="form-check-label" htmlFor={id + '_newAssignmentTemplateDescriptionTypeHtml'}>HTML</label>
            </div>
          </div>
        </div>
        <textarea onChange={props.onDescriptionChange} value={formData.description} id={id + '_newAssignmentTemplateDescription'} rows={4} className={`form-control ${formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentTemplateDescriptionHelp'} />
        <div id={id + '_newAssignmentTemplateDescriptionHelp'} className="form-text">The description of this part{formData.descriptionType === 'text' ? <span className="fw-bold"> (Two <em>ENTER</em> keys in a row will start a new paragraph)</span> : formData.descriptionType === 'html' ? <span className="fw-bold"> (HTML descriptions should use &lt;p&gt; tags)</span> : null}</div>
        {formValidationMessages.description && <div className="invalid-feedback">{formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateMarkingCriteria'} className="form-label">Marking Criteria</label>
        <textarea onChange={props.onMarkingCriteriaChange} value={formData.markingCriteria} id={id + '_newAssignmentTemplateMarkingCriteria'} rows={4} className={`form-control ${formValidationMessages.markingCriteria ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentTemplateMarkingCriteriaHelp'} />
        <div id={id + '_newAssignmentTemplateMarkingCriteriaHelp'} className="form-text">The criteria for marking this assignment <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {formValidationMessages.markingCriteria && <div className="invalid-feedback">{formValidationMessages.markingCriteria}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateAssignmentNumber'} className="form-label">Assignment Number <span className="text-danger">*</span></label>
        <input onChange={props.onAssignmentNumberChange} value={formData.assignmentNumber} type="number" id={id + '_newAssignmentTemplateAssignmentNumber'} min={1} max={127} className={`form-control ${formValidationMessages.assignmentNumber ? 'is-invalid' : ''}`} aria-describedby={id + '_newAssignmentTemplateAssignmentNumberHelp'} required />
        <div id={id + '_newAssignmentTemplateAssignmentNumberHelp'} className="form-text">The ordering for this assignment within its unit (must be unique)</div>
        {formValidationMessages.assignmentNumber && <div className="invalid-feedback">{formValidationMessages.assignmentNumber}</div>}
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={props.onOptionalChange} checked={formData.optional} type="checkbox" id={id + '_newAssignmentTemplateOptional'} className={`form-check-input ${formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newAssignmentTemplateOptional'} className="form-check-label">Optional</label>
          {formValidationMessages.optional && <div className="invalid-feedback">{formValidationMessages.optional}</div>}
        </div>
      </div>

      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
