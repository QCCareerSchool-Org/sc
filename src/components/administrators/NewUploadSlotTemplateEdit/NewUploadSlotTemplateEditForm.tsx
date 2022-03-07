import { ChangeEventHandler, FormEventHandler, memo, MouseEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { AllowedType, NewUploadSlotTemplatePayload } from '@/services/administrators';

type Props = {
  formState: State['form'];
  save$: Subject<{ processingState: State['form']['processingState']; payload: NewUploadSlotTemplatePayload }>;
  delete$: Subject<State['form']['processingState']>;
  labelChange: ChangeEventHandler<HTMLInputElement>;
  imageChange: ChangeEventHandler<HTMLInputElement>;
  pdfChange: ChangeEventHandler<HTMLInputElement>;
  wordChange: ChangeEventHandler<HTMLInputElement>;
  excelChange: ChangeEventHandler<HTMLInputElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateEditForm = memo(({ formState, save$, delete$, labelChange, imageChange, pdfChange, wordChange, excelChange, pointsChange, orderChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
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
    save$.next({
      processingState: formState.processingState,
      payload: {
        label: formState.data.label,
        allowedTypes: Object.keys(formState.data.allowedTypes).reduce<AllowedType[]>((prev, cur) => {
          const key = cur as AllowedType;
          if (formState.data.allowedTypes[key]) {
            prev.push(key);
          }
          return prev;
        }, []),
        points: parseInt(formState.data.points, 10),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  const deleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete this text box template?')) {
      delete$.next(formState.processingState);
    }
  };

  return (
    <>
      <form onSubmit={formSubmit}>
        <div className="formGroup">
          <label htmlFor="newUploadSlotLabel" className="form-label">Label <span className="text-danger">*</span></label>
          <input onChange={labelChange} value={formState.data.label} type="text" id="newUploadSlotLabel" maxLength={191} className={`form-control ${formState.validationMessages.label ? 'is-invalid' : ''}`} required />
          {formState.validationMessages.label && <div className="invalid-feedback">{formState.validationMessages.label}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newUploadSlotPoints" className="form-label">Points <span className="text-danger">*</span></label>
          <input onChange={pointsChange} value={formState.data.points} type="number" id="newUploadSlotPoints" min={0} max={127} className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} required />
          {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="newUploadSlotOrder" className="form-label">Order <span className="text-danger">*</span></label>
          <input onChange={orderChange} value={formState.data.order} type="number" id="newUploadSlotOrder" min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required />
          {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
        </div>
        <div className="formGroup validated">
          <div className="form-check">
            <input onChange={imageChange} checked={formState.data.allowedTypes.image} type="checkbox" id="newUploadSlotImage" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
            <label htmlFor="newUploadSlotImage" className="form-check-label">Image</label>
          </div>
          <div className="form-check">
            <input onChange={pdfChange} checked={formState.data.allowedTypes.pdf} type="checkbox" id="newUploadSlotPDF" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
            <label htmlFor="newUploadSlotPDF" className="form-check-label">PDF</label>
          </div>
          <div className="form-check">
            <input onChange={wordChange} checked={formState.data.allowedTypes.word} type="checkbox" id="newUploadSlotWord" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
            <label htmlFor="newUploadSlotWord" className="form-check-label">Word document</label>
          </div>
          <div className="form-check">
            <input onChange={excelChange} checked={formState.data.allowedTypes.excel} type="checkbox" id="newUploadSlotExcel" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
            <label htmlFor="newUploadSlotExcel" className="form-check-label">Excel document</label>
            {formState.validationMessages.allowedTypes && <div className="invalid-feedback">{formState.validationMessages.allowedTypes}</div>}
          </div>
        </div>
        <div className="formGroup ">
          <div className="form-check">
            <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newUploadSlotOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
            <label htmlFor="newUploadSlotOptional" className="form-check-label">Optional</label>
            {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary me-2" style={{ width: 80 }} disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
          </button>
          <button onClick={deleteClick} className="btn btn-danger" style={{ width: 80 }} disabled={formState.processingState === 'saving' || formState.processingState === 'deleting'}>
            {formState.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
          </button>
          {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Save Error'}</span>}
          {formState.processingState === 'delete error' && <span className="text-danger ms-2">{formState.errorMessage?.length ? formState.errorMessage : 'Delete Error'}</span>}
        </div>
      </form>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
        .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
});

NewUploadSlotTemplateEditForm.displayName = 'NewUploadSlotTemplateEditForm';
