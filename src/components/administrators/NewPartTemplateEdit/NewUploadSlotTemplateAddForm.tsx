import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import { Spinner } from '@/components/Spinner';
import type { NewUploadSlotAllowedType, NewUploadSlotTemplatePayload } from '@/services/administrators/newUploadSlotTemplateService';

type Props = {
  formState: State['newUoloadSlotTemplateForm'];
  insert$: Subject<{ processingState: State['newUoloadSlotTemplateForm']['processingState']; payload: NewUploadSlotTemplatePayload }>;
  labelChange: ChangeEventHandler<HTMLInputElement>;
  pointsChange: ChangeEventHandler<HTMLInputElement>;
  orderChange: ChangeEventHandler<HTMLInputElement>;
  imageChange: ChangeEventHandler<HTMLInputElement>;
  pdfChange: ChangeEventHandler<HTMLInputElement>;
  wordChange: ChangeEventHandler<HTMLInputElement>;
  excelChange: ChangeEventHandler<HTMLInputElement>;
  optionalChange: ChangeEventHandler<HTMLInputElement>;
};

export const NewUploadSlotTemplateAddForm = memo(({ formState, insert$, labelChange, pointsChange, orderChange, imageChange, pdfChange, wordChange, excelChange, optionalChange }: Props): ReactElement => {
  let valid = true;
  // check if there are any validation messages
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof State['newUoloadSlotTemplateForm']['validationMessages'];
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
      processingState: formState.processingState,
      payload: {
        label: formState.data.label,
        points: parseInt(formState.data.points, 10),
        allowedTypes: Object.keys(formState.data.allowedTypes).reduce<NewUploadSlotAllowedType[]>((prev, cur) => {
          const key = cur as NewUploadSlotAllowedType;
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
          <h3 className="h5">New Upload Slot Template</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newUploadSlotTemplateLabel" className="form-label">Label <span className="text-danger">*</span></label>
              <input onChange={labelChange} value={formState.data.label} type="text" id="newUploadSlotTemplateLabel" maxLength={191} className={`form-control ${formState.validationMessages.label ? 'is-invalid' : ''}`} required />
              {formState.validationMessages.label && <div className="invalid-feedback">{formState.validationMessages.label}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotTemplatePoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={formState.data.points} type="number" id="newUploadSlotTemplatePoints" min={0} max={127} className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} required />
              {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotTemplateOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newUploadSlotTemplateOrder" min={0} max={127} className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} required />
              {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
            </div>
            <div className="formGroup validated">
              <div className="form-check">
                <input onChange={imageChange} checked={formState.data.allowedTypes.image} type="checkbox" id="newUploadSlotTemplateImage" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
                <label htmlFor="newUploadSlotTemplateImage" className="form-check-label">Image</label>
              </div>
              <div className="form-check">
                <input onChange={pdfChange} checked={formState.data.allowedTypes.pdf} type="checkbox" id="newUploadSlotTemplatePDF" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
                <label htmlFor="newUploadSlotTemplatePDF" className="form-check-label">PDF</label>
              </div>
              <div className="form-check">
                <input onChange={wordChange} checked={formState.data.allowedTypes.word} type="checkbox" id="newUploadSlotTemplateWord" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
                <label htmlFor="newUploadSlotTemplateWord" className="form-check-label">Word document</label>
              </div>
              <div className="form-check">
                <input onChange={excelChange} checked={formState.data.allowedTypes.excel} type="checkbox" id="newUploadSlotTemplateExcel" className={`form-check-input ${formState.validationMessages.allowedTypes ? 'is-invalid' : ''}`} />
                <label htmlFor="newUploadSlotTemplateExcel" className="form-check-label">Excel document</label>
                {formState.validationMessages.allowedTypes && <div className="invalid-feedback">{formState.validationMessages.allowedTypes}</div>}
              </div>
            </div>
            <div className="formGroup ">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newUploadSlotTemplateOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newUploadSlotTemplateOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={!valid || formState.processingState === 'inserting'}>
                {formState.processingState === 'inserting' ? <Spinner size="sm" /> : 'Add'}
              </button>
              {formState.processingState === 'insert error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
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

NewUploadSlotTemplateAddForm.displayName = 'NewUploadSlotTemplateAddForm';
