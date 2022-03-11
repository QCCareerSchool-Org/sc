import type { ChangeEventHandler, ReactElement } from 'react';

import type { State } from './state';

type Props = {
  formData: State['form']['data'];
  formValidationMessages: State['form']['validationMessages'];
  labelChange: ChangeEventHandler<HTMLInputElement>;
  imageChange: ChangeEventHandler<HTMLInputElement>;
  pdfChange: ChangeEventHandler<HTMLInputElement>;
  wordChange: ChangeEventHandler<HTMLInputElement>;
  excelChange: ChangeEventHandler<HTMLInputElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateFormElements = ({ formData, formValidationMessages, labelChange, imageChange, pdfChange, wordChange, excelChange, pointsChange, orderChange, optionalChange }: Props): ReactElement => {
  // const id = useId(); // react 18
  const id = Math.random().toString(32).slice(2);
  return (
    <>
      <div className="formGroup">
        <label htmlFor={id + '_newUploadSlotLabel'} className="form-label">Label <span className="text-danger">*</span></label>
        <input onChange={labelChange} value={formData.label} type="text" id={id + '_newUploadSlotLabel'} maxLength={191} className={`form-control ${formValidationMessages.label ? 'is-invalid' : ''}`} required />
        {formValidationMessages.label && <div className="invalid-feedback">{formValidationMessages.label}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUploadSlotPoints'} className="form-label">Points <span className="text-danger">*</span></label>
        <input onChange={pointsChange} value={formData.points} type="number" id={id + '_newUploadSlotPoints'} min={0} max={127} className={`form-control ${formValidationMessages.points ? 'is-invalid' : ''}`} required />
        {formValidationMessages.points && <div className="invalid-feedback">{formValidationMessages.points}</div>}
      </div>
      <div className="formGroup">
        <label htmlFor={id + '_newUploadSlotOrder'} className="form-label">Order <span className="text-danger">*</span></label>
        <input onChange={orderChange} value={formData.order} type="number" id={id + '_newUploadSlotOrder'} min={0} max={127} className={`form-control ${formValidationMessages.order ? 'is-invalid' : ''}`} required />
        {formValidationMessages.order && <div className="invalid-feedback">{formValidationMessages.order}</div>}
      </div>
      <div className="formGroup validated">
        <div className="form-check">
          <input onChange={imageChange} checked={formData.allowedTypes.image} type="checkbox" id={id + '_newUploadSlotImage'} className={`form-check-input ${formValidationMessages.allowedTypes ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUploadSlotImage'} className="form-check-label">Image</label>
        </div>
        <div className="form-check">
          <input onChange={pdfChange} checked={formData.allowedTypes.pdf} type="checkbox" id={id + '_newUploadSlotPDF'} className={`form-check-input ${formValidationMessages.allowedTypes ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUploadSlotPDF'} className="form-check-label">PDF</label>
        </div>
        <div className="form-check">
          <input onChange={wordChange} checked={formData.allowedTypes.word} type="checkbox" id={id + '_newUploadSlotWord'} className={`form-check-input ${formValidationMessages.allowedTypes ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUploadSlotWord'} className="form-check-label">Word document</label>
        </div>
        <div className="form-check">
          <input onChange={excelChange} checked={formData.allowedTypes.excel} type="checkbox" id={id + '_newUploadSlotExcel'} className={`form-check-input ${formValidationMessages.allowedTypes ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUploadSlotExcel'} className="form-check-label">Excel document</label>
          {formValidationMessages.allowedTypes && <div className="invalid-feedback">{formValidationMessages.allowedTypes}</div>}
        </div>
      </div>
      <div className="formGroup">
        <div className="form-check">
          <input onChange={optionalChange} checked={formData.optional} type="checkbox" id={id + '_newUploadSlotOptional'} className={`form-check-input ${formValidationMessages.optional ? 'is-invalid' : ''}`} />
          <label htmlFor={id + '_newUploadSlotOptional'} className="form-check-label">Optional</label>
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
