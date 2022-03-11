import type { ChangeEventHandler, ReactElement } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  assignmentNumberChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewAssignmentTemplateFormElements = ({ formData, formValidationMessages, titleChange, descriptionChange, assignmentNumberChange, optionalChange }: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = Math.random().toString(32).slice(2);
  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateTitle'} className="form-label">Title</label>
        <input onChange={titleChange} value={formData.title} type="text" id={id + '_newAssignmentTemplateTitle'} maxLength={191} className={`form-control ${formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentTemplateTitleHelp'} />
        <div id={id + '_newAssignmentTemplateTitleHelp'} className="form-text">The title of this assignment</div>
        {formValidationMessages.title && <div className="invalid-feedback">{formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateDescription'} className="form-label">Description</label>
        <textarea onChange={descriptionChange} value={formData.description} id={id + '_newAssignmentTemplateDescription'} rows={5} className={`form-control ${formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newAssignmentTemplateDescriptionHelp'} />
        <div id={id + '_newAssignmentTemplateDescriptionHelp'} className="form-text">The description of this assignment <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {formValidationMessages.description && <div className="invalid-feedback">{formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newAssignmentTemplateAssignmentNumber'} className="form-label">Assignment Number <span className="text-danger">*</span></label>
        <input onChange={assignmentNumberChange} value={formData.assignmentNumber} type="number" id={id + '_newAssignmentTemplateAssignmentNumber'} min={1} max={127} className={`form-control ${formValidationMessages.assignmentNumber ? 'is-invalid' : ''}`} aria-describedby={id + '_newAssignmentTemplateAssignmentNumberHelp'} required />
        <div id={id + '_newAssignmentTemplateAssignmentNumberHelp'} className="form-text">The ordering for this assignment within its unit (must be unique)</div>
        {formValidationMessages.assignmentNumber && <div className="invalid-feedback">{formValidationMessages.assignmentNumber}</div>}
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={optionalChange} checked={formData.optional} type="checkbox" id={id + '_newAssignmentTemplateOptional'} className={`form-check-input ${formValidationMessages.optional ? 'is-invalid' : ''}`} />
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
