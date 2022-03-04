import { useRouter } from 'next/router';
import { FormEventHandler, ReactElement, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';

import type { NewUploadSlotSubmitFunction } from '.';
import { Spinner } from '@/components/Spinner';
import { AllowedType, NewUploadSlotPayload } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type FormState = {
  data: {
    label: string;
    points: string;
    allowedTypes: {
      image: boolean;
      pdf: boolean;
      word: boolean;
      excel: boolean;
    };
    order: string;
    optional: boolean;
  };
  validationMessages: {
    label?: string;
    points?: string;
    allowedTypes?: string;
    order?: string;
    optional?: string;
  };
  saveState: 'idle' | 'processing' | 'error';
  errorMessage?: string;
};

type FormAction =
  | { type: 'LABEL_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: string }
  | { type: 'IMAGE_UPDATED'; payload: boolean }
  | { type: 'PDF_UPDATED'; payload: boolean }
  | { type: 'WORD_UPDATED'; payload: boolean }
  | { type: 'EXCEL_UPDATED'; payload: boolean }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'SAVE_STARTED' }
  | { type: 'SAVE_SUCCEEDED'; payload: { nextOrder: number } }
  | { type: 'SAVE_FAILED'; payload: string };

const formInitialState: FormState = {
  data: {
    label: '',
    points: '1',
    allowedTypes: {
      image: true,
      pdf: false,
      word: false,
      excel: false,
    },
    order: '0',
    optional: false,
  },
  validationMessages: {},
  saveState: 'idle',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'LABEL_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      }
      return {
        ...state,
        data: { ...state.data, label: action.payload },
        validationMessages: { ...state.validationMessages, label: validationMessage },
      };
    }
    case 'POINTS_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      } else {
        const points = parseInt(action.payload, 10);
        if (isNaN(points)) {
          validationMessage = 'Invalid number';
        } else if (points < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (points > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        data: { ...state.data, points: action.payload },
        validationMessages: { ...state.validationMessages, points: validationMessage },
      };
    }
    case 'ORDER_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      } else {
        const points = parseInt(action.payload, 10);
        if (isNaN(points)) {
          validationMessage = 'Invalid number';
        } else if (points < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (points > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        data: { ...state.data, order: action.payload },
        validationMessages: { ...state.validationMessages, order: validationMessage },
      };
    }
    case 'IMAGE_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.data.allowedTypes.pdf && !state.data.allowedTypes.word && !state.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, image: action.payload } },
        validationMessages: { ...state.validationMessages, allowedTypes: validationMessage },
      };
    }
    case 'PDF_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.data.allowedTypes.image && !state.data.allowedTypes.word && !state.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, pdf: action.payload } },
        validationMessages: { ...state.validationMessages, allowedTypes: validationMessage },
      };
    }
    case 'WORD_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.data.allowedTypes.image && !state.data.allowedTypes.pdf && !state.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, word: action.payload } },
        validationMessages: { ...state.validationMessages, allowedTypes: validationMessage },
      };
    }
    case 'EXCEL_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.data.allowedTypes.image && !state.data.allowedTypes.pdf && !state.data.allowedTypes.word) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, excel: action.payload } },
        validationMessages: { ...state.validationMessages, allowedTypes: validationMessage },
      };
    }
    case 'OPTIONAL_UPDATED':
      return { ...state, data: { ...state.data, optional: action.payload } };
    case 'SAVE_STARTED':
      return { ...state, saveState: 'processing', errorMessage: undefined };
    case 'SAVE_SUCCEEDED':
      return { ...state, ...formInitialState, data: { ...formInitialState.data, order: action.payload.nextOrder.toString() } };
    case 'SAVE_FAILED':
      return { ...state, saveState: 'error', errorMessage: action.payload };
  }
};

type Props = {
  nextOrder: number;
  submit: NewUploadSlotSubmitFunction;
};

export const NewUploadSlotForm = ({ nextOrder, submit }: Props): ReactElement => {
  const router = useRouter();

  const [ formState, formDispatch ] = useReducer(formReducer, { ...formInitialState, data: { ...formInitialState.data, order: nextOrder.toString() } });

  useEffect(() => {
    formDispatch({ type: 'ORDER_UPDATED', payload: nextOrder.toString() });
  }, [ nextOrder ]);

  const submit$ = useRef(new Subject<NewUploadSlotPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    submit$.current.pipe(
      tap(() => formDispatch({ type: 'SAVE_STARTED' })),
      exhaustMap(payload => submit(payload).pipe(
        tap({
          next: () => {
            formDispatch({ type: 'SAVE_SUCCEEDED', payload: { nextOrder } });
          },
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.refresh) {
                return navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            formDispatch({ type: 'SAVE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, submit, nextOrder ]);

  const labelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    const maxLength = 191;
    const newLength = (new TextEncoder().encode(target.value).length);
    if (newLength <= maxLength) {
      formDispatch({ type: 'LABEL_UPDATED', payload: target.value });
    }
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'POINTS_UPDATED', payload: target.value });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'ORDER_UPDATED', payload: target.value });
  };

  const imageChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'IMAGE_UPDATED', payload: target.checked });
  };

  const pdfChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'PDF_UPDATED', payload: target.checked });
  };

  const wordChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'WORD_UPDATED', payload: target.checked });
  };

  const excelChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'EXCEL_UPDATED', payload: target.checked });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  let valid = true;
  for (const key in formState.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(formState.validationMessages, key)) {
      const validationMessage = key as keyof FormState['validationMessages'];
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
    submit$.current.next({
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
};
