import { FormEventHandler, memo, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { AllowedType, NewUploadSlotTemplatePayload } from '@/services/administrators';

type Props = {
  formState: State['uploadSlotForm'];
  insert$: Subject<{ saveState: State['uploadSlotForm']['saveState']; payload: NewUploadSlotTemplatePayload }>;
  labelChange: FormEventHandler<HTMLInputElement>;
  pointsChange: FormEventHandler<HTMLInputElement>;
  orderChange: FormEventHandler<HTMLInputElement>;
  imageChange: FormEventHandler<HTMLInputElement>;
  pdfChange: FormEventHandler<HTMLInputElement>;
  wordChange: FormEventHandler<HTMLInputElement>;
  excelChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewUploadSlotForm = memo(({ formState, insert$, labelChange, pointsChange, orderChange, imageChange, pdfChange, wordChange, excelChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['uploadSlotForm']['validationMessages'];
      if (formState.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    insert$.next({
      saveState: formState.saveState,
      payload: {
        label: formState.data.label,
        points: parseInt(formState.data.points, 10),
        allowedTypes: Object.keys(formState.data.allowedTypes).reduce<AllowedType[]>((prev, cur) => {
          const key = cur as AllowedType;
          if (formState.data.allowedTypes[key]) {
            prev.push(key);
          }
          return prev;
        }, []),
        order: parseInt(formState.data.order, 10),
        optional: formState.data.optional,
      },
    });
  };

  return (
    <>
      <div id="newUploadSlotCard" className="card">
        <div className="card-body">
          <h3 className="h5">New Upload Slot</h3>
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
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.saveState === 'processing'}>Add New Upload Slot</button>
              {formState.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {formState.saveState === 'error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
});

NewUploadSlotForm.displayName = 'NewUploadSlotForm';
