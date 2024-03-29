import type { ChangeEventHandler, FC } from 'react';
import { useId } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDescriptionTypeChange: ChangeEventHandler<HTMLInputElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onPartNumberChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewPartTemplateFormElements: FC<Props> = props => {
  const { formData, formValidationMessages } = props;
  const id = useId();

  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newPartTemplateTitle'} className="form-label">Title <span className="text-danger">*</span></label>
        <input onChange={props.onTitleChange} value={formData.title} type="text" id={id + '_newPartTemplateTitle'} maxLength={191} className={`form-control ${formValidationMessages.title ? 'is-invalid' : ''}`} aria-describedby={id + '_newPartTemplateTitleHelp'} required />
        <div id={id + '_newPartTemplateTitleHelp'} className="form-text">The title of this part (for internal use only)</div>
        {formValidationMessages.title && <div className="invalid-feedback">{formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newPartTemplateDescription'} className="form-label">Description</label>
        <div className="row gx-3 align-items-center">
          <div className="col-auto">
            <div className="form-check">
              <input onChange={props.onDescriptionTypeChange} checked={formData.descriptionType === 'text'} className="form-check-input" type="radio" name="descriptionType" value="text" id={id + '_newPartTemplateDescriptionTypeText'} />
              <label className="form-check-label" htmlFor={id + '_newPartTemplateDescriptionTypeText'}>Text</label>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-check">
              <input onChange={props.onDescriptionTypeChange} checked={formData.descriptionType === 'html'} className="form-check-input" type="radio" name="descriptionType" value="html" id={id + '_newPartTemplateDescriptionTypeHtml'} />
              <label className="form-check-label" htmlFor={id + '_newPartTemplateDescriptionTypeHtml'}>HTML</label>
            </div>
          </div>
        </div>
        <textarea onChange={props.onDescriptionChange} value={formData.description} id={id + '_newPartTemplateDescription'} rows={4} className={`form-control ${formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newPartTemplateDescriptionHelp'} />
        <div id={id + '_newPartTemplateDescriptionHelp'} className="form-text">The description of this part{formData.descriptionType === 'text' ? <span className="fw-bold"> (Two <em>ENTER</em> keys in a row will start a new paragraph)</span> : formData.descriptionType === 'html' ? <span className="fw-bold"> (HTML descriptions should use &lt;p&gt; tags)</span> : null}</div>
        {formValidationMessages.description && <div className="invalid-feedback">{formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newPartTemplateMarkingCriteria'} className="form-label">Marking Criteria</label>
        <textarea onChange={props.onMarkingCriteriaChange} value={formData.markingCriteria} id={id + '_newPartTemplateMarkingCriteria'} rows={4} className={`form-control ${formValidationMessages.markingCriteria ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newPartTemplateMarkingCriteriaHelp'} />
        <div id={id + '_newPartTemplateMarkingCriteriaHelp'} className="form-text">The description of this part <span className="fw-bold"> (Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {formValidationMessages.markingCriteria && <div className="invalid-feedback">{formValidationMessages.markingCriteria}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newPartTemplatePartNumber'} className="form-label">Part Number <span className="text-danger">*</span></label>
        <input onChange={props.onPartNumberChange} value={formData.partNumber} type="number" id={id + '_newPartTemplatePartNumber'} min={1} max={127} className={`form-control ${formValidationMessages.partNumber ? 'is-invalid' : ''}`} aria-describedby={id + '_newPartTemplatePartNumberHelp'} required />
        <div id={id + '_newPartTemplatePartNumberHelp'} className="form-text">The ordering for this part within its assignment (must be unique)</div>
        {formValidationMessages.partNumber && <div className="invalid-feedback">{formValidationMessages.partNumber}</div>}
      </div>

      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
