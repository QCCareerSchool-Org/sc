import type { ChangeEventHandler, ReactElement } from 'react';
// import { useId } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  titleChange: ChangeEventHandler<HTMLInputElement>;
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  unitLetterChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUnitTemplateFormElements = ({ formData, formValidationMessages, titleChange, descriptionChange, unitLetterChange, orderChange, optionalChange }: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = Math.random().toString(32).slice(2);
  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateTitle'} className="form-label">Title</label>
        <input onChange={titleChange} value={formData.title} type="text" id={id + '_newUnitTemplateTitle'} maxLength={191} className={`form-control ${formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newUnitTemplateTitleHelp'} />
        <div id={id + '_newUnitTemplateTitleHelp'} className="form-text">The title of this unit</div>
        {formValidationMessages.title && <div className="invalid-feedback">{formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateDescription'} className="form-label">Description</label>
        <textarea onChange={descriptionChange} value={formData.description} id={id + '_newUnitTemplateDescription'} rows={10} className={`form-control ${formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newUnitTemplateDescriptionHelp'} />
        <div id={id + '_newUnitTemplateDescriptionHelp'} className="form-text">The description for this unit <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {formValidationMessages.description && <div className="invalid-feedback">{formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitTemplateUnitLetter'} className="form-label">Unit Letter <span className="text-danger">*</span></label>
        <input onChange={unitLetterChange} value={formData.unitLetter} type="text" id={id + '_newUnitTemplateUnitLetter'} maxLength={1} className={`form-control ${formValidationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby={id + '_newUnitTemplateUnitLetterHelp'} required />
        <div id={id + '_newUnitTemplateUnitLetterHelp'} className="form-text">The letter for this unit (must be unique)</div>
        {formValidationMessages.unitLetter && <div className="invalid-feedback">{formValidationMessages.unitLetter}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUnitOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={orderChange} value={formData.order} type="number" id={id + '_newUnitOrder'} min={0} max={127} className={`form-control ${formValidationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newUnitOrderHelp'} />
        <div id={id + '_newUnitOrderHelp'} className="form-text">The order in which the unit should appear within its course</div>
        {formValidationMessages.order && <div className="invalid-feedback">{formValidationMessages.order}</div>}
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={optionalChange} checked={formData.optional} type="checkbox" id={id + '_newUnitTemplateOptional'} className={`form-check-input ${formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUnitTemplateOptional'} className="form-check-label">Optional</label>
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
