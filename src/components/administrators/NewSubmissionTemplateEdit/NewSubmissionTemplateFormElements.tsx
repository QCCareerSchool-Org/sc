import type { ChangeEventHandler, FC } from 'react';
import { useId } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
  onOptionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewSubmissionTemplateFormElements: FC<Props> = props => {
  const id = useId();

  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newSubmissionTemplateTitle'} className="form-label">Title</label>
        <input onChange={props.onTitleChange} value={props.formData.title} type="text" id={id + '_newSubmissionTemplateTitle'} maxLength={191} className={`form-control ${props.formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newSubmissionTemplateTitleHelp'} />
        <div id={id + '_newSubmissionTemplateTitleHelp'} className="form-text">The title of this unit</div>
        {props.formValidationMessages.title && <div className="invalid-feedback">{props.formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newSubmissionTemplateDescription'} className="form-label">Description</label>
        <textarea onChange={props.onDescriptionChange} value={props.formData.description} id={id + '_newSubmissionTemplateDescription'} rows={4} className={`form-control ${props.formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newSubmissionTemplateDescriptionHelp'} />
        <div id={id + '_newSubmissionTemplateDescriptionHelp'} className="form-text">The description for this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {props.formValidationMessages.description && <div className="invalid-feedback">{props.formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newSubmissionTemplateMarkingCriteria'} className="form-label">Marking Criteria</label>
        <textarea onChange={props.onMarkingCriteriaChange} value={props.formData.markingCriteria} id={id + '_newSubmissionTemplateMarkingCriteria'} rows={4} className={`form-control ${props.formValidationMessages.markingCriteria ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newSubmissionTemplateMarkingCriteriaHelp'} />
        <div id={id + '_newSubmissionTemplateMarkingCriteriaHelp'} className="form-text">The criteria for marking this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {props.formValidationMessages.markingCriteria && <div className="invalid-feedback">{props.formValidationMessages.markingCriteria}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newSubmissionTemplateUnitLetter'} className="form-label">Unit Letter <span className="text-danger">*</span></label>
        <input onChange={props.onUnitLetterChange} value={props.formData.unitLetter} type="text" id={id + '_newSubmissionTemplateUnitLetter'} maxLength={1} className={`form-control ${props.formValidationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby={id + '_newSubmissionTemplateUnitLetterHelp'} required />
        <div id={id + '_newSubmissionTemplateUnitLetterHelp'} className="form-text">The letter for this unit (must be unique)</div>
        {props.formValidationMessages.unitLetter && <div className="invalid-feedback">{props.formValidationMessages.unitLetter}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={props.onOrderChange} value={props.formData.order} type="number" id={id + '_newUnitOrder'} min={0} max={127} className={`form-control ${props.formValidationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newUnitOrderHelp'} />
        <div id={id + '_newUnitOrderHelp'} className="form-text">The order in which the unit should appear within its course</div>
        {props.formValidationMessages.order && <div className="invalid-feedback">{props.formValidationMessages.order}</div>}
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={props.onOptionalChange} checked={props.formData.optional} type="checkbox" id={id + '_newSubmissionTemplateOptional'} className={`form-check-input ${props.formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newSubmissionTemplateOptional'} className="form-check-label">Optional</label>
          {props.formValidationMessages.optional && <div className="invalid-feedback">{props.formValidationMessages.optional}</div>}
        </div>
      </div>

      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
