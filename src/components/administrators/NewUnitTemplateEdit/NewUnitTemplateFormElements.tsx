import type { ChangeEventHandler, ReactElement } from 'react';
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

export const NewUnitTemplateFormElements = (props: Props): ReactElement => {
  const id = useId();

  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateTitle'} className="form-label">Title</label>
        <input onChange={props.onTitleChange} value={props.formData.title} type="text" id={id + '_newUnitTemplateTitle'} maxLength={191} className={`form-control ${props.formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newUnitTemplateTitleHelp'} />
        <div id={id + '_newUnitTemplateTitleHelp'} className="form-text">The title of this unit</div>
        {props.formValidationMessages.title && <div className="invalid-feedback">{props.formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateDescription'} className="form-label">Description</label>
        <textarea onChange={props.onDescriptionChange} value={props.formData.description} id={id + '_newUnitTemplateDescription'} rows={4} className={`form-control ${props.formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newUnitTemplateDescriptionHelp'} />
        <div id={id + '_newUnitTemplateDescriptionHelp'} className="form-text">The description for this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {props.formValidationMessages.description && <div className="invalid-feedback">{props.formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateMarkingCriteria'} className="form-label">Marking Criteria</label>
        <textarea onChange={props.onMarkingCriteriaChange} value={props.formData.markingCriteria} id={id + '_newUnitTemplateMarkingCriteria'} rows={4} className={`form-control ${props.formValidationMessages.markingCriteria ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newUnitTemplateMarkingCriteriaHelp'} />
        <div id={id + '_newUnitTemplateMarkingCriteriaHelp'} className="form-text">The criteria for marking this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {props.formValidationMessages.markingCriteria && <div className="invalid-feedback">{props.formValidationMessages.markingCriteria}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateUnitLetter'} className="form-label">Unit Letter <span className="text-danger">*</span></label>
        <input onChange={props.onUnitLetterChange} value={props.formData.unitLetter} type="text" id={id + '_newUnitTemplateUnitLetter'} maxLength={1} className={`form-control ${props.formValidationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby={id + '_newUnitTemplateUnitLetterHelp'} required />
        <div id={id + '_newUnitTemplateUnitLetterHelp'} className="form-text">The letter for this unit (must be unique)</div>
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
          <input onChange={props.onOptionalChange} checked={props.formData.optional} type="checkbox" id={id + '_newUnitTemplateOptional'} className={`form-check-input ${props.formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUnitTemplateOptional'} className="form-check-label">Optional</label>
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
