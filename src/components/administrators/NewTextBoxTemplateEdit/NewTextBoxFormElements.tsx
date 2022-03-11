import type { ChangeEventHandler, ReactElement } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  descriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  linesChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewTextBoxFormElements = ({ formData, formValidationMessages, descriptionChange, pointsChange, linesChange, orderChange, optionalChange }: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = Math.random().toString().slice(2);
  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newTextBoxTemplateDescription'} className="form-label">Description</label>
        <textarea onChange={descriptionChange} value={formData.description} id={id + '_newTextBoxTemplateDescription'} rows={5} className={`form-control ${formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newTextBoxTemplateDescriptionHelp'} />
        <div id={id + '_newTextBoxTemplateDescriptionHelp'} className="form-text">A description of what should be enterered into the text box</div>
        {formValidationMessages.description && <div className="invalid-feedback">{formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newTextBoxTemplatePoints'} className="form-label">Points <span className="text-danger">*</span></label>
        <input onChange={pointsChange} value={formData.points} type="number" id={id + '_newTextBoxTemplatePoints'} min={0} max={127} className={`form-control ${formValidationMessages.points ? 'is-invalid' : ''}`} aria-describedby={id + '_newTextBoxTemplatePointsHelp'} required />
        <div id={id + '_newTextBoxTemplatePointsHelp'} className="form-text">The maximum mark for the text box</div>
        {formValidationMessages.points && <div className="invalid-feedback">{formValidationMessages.points}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newTextBoxTemplateLines'} className="form-label">Lines</label>
        <input onChange={linesChange} value={formData.lines} type="number" id={id + '_newTextBoxTemplateLines'} min={1} max={127} className={`form-control ${formValidationMessages.lines ? 'is-invalid' : ''}`} placeholder="(default)" aria-describedby={id + '_newTextBoxTemplateLinesHelp'} />
        <div id={id + '_newTextBoxTemplateLinesHelp'} className="form-text">The size of the text box (for display purposes only)</div>
        {formValidationMessages.lines && <div className="invalid-feedback">{formValidationMessages.lines}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newTextBoxTemplateOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={orderChange} value={formData.order} type="number" id={id + '_newTextBoxTemplateOrder'} min={0} max={127} className={`form-control ${formValidationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newTextBoxTemplateOrderHelp'} />
        <div id={id + '_newTextBoxTemplateOrderHelp'} className="form-text">The order in which the text box should appear within its part</div>
        {formValidationMessages.order && <div className="invalid-feedback">{formValidationMessages.order}</div>}
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={optionalChange} checked={formData.optional} type="checkbox" id={id + '_newTextBoxTemplateOptional'} className={`form-check-input ${formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newTextBoxTemplateOptional'} className="form-check-label">Optional</label>
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
