import type { ChangeEventHandler, ReactElement } from 'react';
import { useRef } from 'react';
// import { useId } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  onTitleChange: ChangeEventHandler<HTMLInputElement>;
  onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>;
  onUnitLetterChange: ChangeEventHandler<HTMLInputElement>;
  onOrderChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewMaterialFormElements = (props: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2)).current;
  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTemplateTitle'} className="form-label">Title <span className="text-danger">*</span></label>
        <input onChange={props.onTitleChange} value={props.formData.title} type="text" id={id + '_newMaterialTemplateTitle'} maxLength={191} className={`form-control ${props.formValidationMessages.title ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTemplateTitleHelp'} />
        <div id={id + '_newMaterialTemplateTitleHelp'} className="form-text">The title of this material</div>
        {props.formValidationMessages.title && <div className="invalid-feedback">{props.formValidationMessages.title}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTemplateDescription'} className="form-label">Description <span className="text-danger">*</span></label>
        <textarea onChange={props.onDescriptionChange} value={props.formData.description} id={id + '_newMaterialTemplateDescription'} rows={4} className={`form-control ${props.formValidationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby={id + '_newMaterialTemplateDescriptionHelp'} />
        <div id={id + '_newMaterialTemplateDescriptionHelp'} className="form-text">The description for this material <span className="fw-bold">(Two <em>ENTER</em> keys in a row will start a new paragraph)</span></div>
        {props.formValidationMessages.description && <div className="invalid-feedback">{props.formValidationMessages.description}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialTemplateUnitLetter'} className="form-label">Unit Letter <span className="text-danger">*</span></label>
        <input onChange={props.onUnitLetterChange} value={props.formData.unitLetter} type="text" id={id + '_newMaterialTemplateUnitLetter'} maxLength={1} className={`form-control ${props.formValidationMessages.unitLetter ? 'is-invalid' : ''}`} aria-describedby={id + '_newMaterialTemplateUnitLetterHelp'} required />
        <div id={id + '_newMaterialTemplateUnitLetterHelp'} className="form-text">The unit for this material</div>
        {props.formValidationMessages.unitLetter && <div className="invalid-feedback">{props.formValidationMessages.unitLetter}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newMaterialOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={props.onOrderChange} value={props.formData.order} type="number" id={id + '_newMaterialOrder'} min={0} max={127} className={`form-control ${props.formValidationMessages.order ? 'is-invalid' : ''}`} required aria-describedby={id + '_newMaterialOrderHelp'} />
        <div id={id + '_newMaterialOrderHelp'} className="form-text">The order in which the material should appear within its unit</div>
        {props.formValidationMessages.order && <div className="invalid-feedback">{props.formValidationMessages.order}</div>}
      </div>

      <style jsx>{`
      .formGroup { margin-bottom: 1rem; }
      .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
