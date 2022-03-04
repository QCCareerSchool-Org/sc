import { FormEventHandler, ReactElement, useEffect, useRef } from 'react';
import { exhaustMap, Observable, Subject, takeUntil } from 'rxjs';

import { State } from './state';
import { Spinner } from '@/components/Spinner';
import { NewUploadSlotTemplate } from '@/domain/index';
import { AllowedType, NewUploadSlotTemplatePayload } from '@/services/administrators';

type SaveFunction = (payload: NewUploadSlotTemplatePayload) => Observable<NewUploadSlotTemplate>;

type Props = {
  formState: State['form'];
  save: SaveFunction;
  labelChange: FormEventHandler<HTMLInputElement>;
  imageChange: FormEventHandler<HTMLInputElement>;
  pdfChange: FormEventHandler<HTMLInputElement>;
  wordChange: FormEventHandler<HTMLInputElement>;
  excelChange: FormEventHandler<HTMLInputElement>;
  pointsChange: FormEventHandler<HTMLInputElement>;
  orderChange: FormEventHandler<HTMLInputElement>;
  optionalChange: FormEventHandler<HTMLInputElement>;
};

export const NewUploadSlotEditForm = ({ formState, save, labelChange, imageChange, pdfChange, wordChange, excelChange, pointsChange, orderChange, optionalChange }: Props): ReactElement => {

  const submit$ = useRef(new Subject<NewUploadSlotTemplatePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // each time we get a submit, call the save function
    submit$.current.pipe(
      exhaustMap(payload => save(payload)),
      takeUntil(destroy$),
    ).subscribe(); // errors swallowed in inner observable

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ save ]);

  let valid = true;
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
    submit$.current.next({
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
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newUploadSlotLabel" className="form-label">Label <span className="text-danger">*</span></label>
              <input onChange={labelChange} value={formState.data.label} type="text" id="newUploadSlotLabel" className={`form-control ${formState.validationMessages.label ? 'is-invalid' : ''}`} required />
              {formState.validationMessages.label && <div className="invalid-feedback">{formState.validationMessages.label}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotPoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={formState.data.points} type="number" id="newUploadSlotPoints" className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} min={0} max={127} required />
              {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newUploadSlotOrder" className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} min={0} max={127} required />
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
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.processingState === 'saving' || formState.processingState === 'deleting'}>Save</button>
              {formState.processingState === 'saving' && <div className="ms-2"><Spinner /></div>}
              {formState.processingState === 'save error' && <span className="text-danger ms-2">{formState.saveErrorMessage ? formState.saveErrorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};
