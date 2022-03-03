import { FormEventHandler, ReactElement, useEffect, useReducer } from 'react';

import type { NewUploadSlotSubmitFunction } from '.';
import { Spinner } from '@/components/Spinner';

type FormState = {
  data: {
    label: string;
    points: number;
    allowedTypes: {
      image: boolean;
      pdf: boolean;
      word: boolean;
      excel: boolean;
    };
    order: number;
    optional: boolean;
  };
  saveState: 'idle' | 'processing' | 'error';
  errorMessage?: string;
};

type FormAction =
  | { type: 'LABEL_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: number }
  | { type: 'ORDER_UPDATED'; payload: number }
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
    points: 1,
    allowedTypes: {
      image: true,
      pdf: false,
      word: false,
      excel: false,
    },
    order: 0,
    optional: false,
  },
  saveState: 'idle',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'LABEL_UPDATED':
      return { ...state, data: { ...state.data, label: action.payload } };
    case 'POINTS_UPDATED':
      return { ...state, data: { ...state.data, points: action.payload } };
    case 'ORDER_UPDATED':
      return { ...state, data: { ...state.data, order: action.payload } };
    case 'IMAGE_UPDATED':
      return { ...state, data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, image: action.payload } } };
    case 'PDF_UPDATED':
      return { ...state, data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, pdf: action.payload } } };
    case 'WORD_UPDATED':
      return { ...state, data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, word: action.payload } } };
    case 'EXCEL_UPDATED':
      return { ...state, data: { ...state.data, allowedTypes: { ...state.data.allowedTypes, excel: action.payload } } };
    case 'OPTIONAL_UPDATED':
      return { ...state, data: { ...state.data, optional: action.payload } };
    case 'SAVE_STARTED':
      return { ...state, saveState: 'processing', errorMessage: undefined };
    case 'SAVE_SUCCEEDED':
      return { ...state, ...formInitialState, data: { ...formInitialState.data, order: action.payload.nextOrder } };
    case 'SAVE_FAILED':
      return { ...state, saveState: 'error', errorMessage: action.payload };
  }
};

type Props = {
  nextOrder: number;
  submit: NewUploadSlotSubmitFunction;
};

export const NewUploadSlotForm = ({ nextOrder, submit }: Props): ReactElement => {
  const [ form, formDispatch ] = useReducer(formReducer, { ...formInitialState, data: { ...formInitialState.data, order: nextOrder } });

  useEffect(() => {
    formDispatch({ type: 'ORDER_UPDATED', payload: nextOrder });
  }, [ nextOrder ]);

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
    formDispatch({ type: 'POINTS_UPDATED', payload: Math.max(parseInt(target.value, 10), 1) });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'ORDER_UPDATED', payload: Math.max(parseInt(target.value, 10), 0) });
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

  const valid = form.data.label.length > 0
    && !isNaN(form.data.points)
    && form.data.points >= 1
    && (form.data.allowedTypes.image || form.data.allowedTypes.pdf || form.data.allowedTypes.word || form.data.allowedTypes.excel)
    && !isNaN(form.data.order)
    && form.data.order >= 0;

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    formDispatch({ type: 'SAVE_STARTED' });
    submit({
      label: form.data.label,
      points: form.data.points,
      allowedTypes: {
        image: form.data.allowedTypes.image,
        pdf: form.data.allowedTypes.pdf,
        word: form.data.allowedTypes.word,
        excel: form.data.allowedTypes.excel,
      },
      order: form.data.order,
      optional: form.data.optional,
    }).then(() => {
      formDispatch({ type: 'SAVE_SUCCEEDED', payload: { nextOrder } });
    }).catch(err => {
      formDispatch({ type: 'SAVE_FAILED', payload: err.message });
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
              <input onChange={labelChange} value={form.data.label} type="text" id="newUploadSlotLabel" className="form-control" required />
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotPoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={form.data.points} type="number" id="newUploadSlotPoints" className="form-control" min={1} required />
            </div>
            <div className="formGroup">
              <label htmlFor="newUploadSlotOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={form.data.order} type="number" id="newUploadSlotOrder" className="form-control" min={0} required />
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={imageChange} checked={form.data.allowedTypes.image} type="checkbox" id="newUploadSlotImage" className="form-check-input" />
                <label htmlFor="newUploadSlotImage" className="form-check-label">image</label>
              </div>
              <div className="form-check">
                <input onChange={pdfChange} checked={form.data.allowedTypes.pdf} type="checkbox" id="newUploadSlotPDF" className="form-check-input" />
                <label htmlFor="newUploadSlotPDF" className="form-check-label">PDF</label>
              </div>
              <div className="form-check">
                <input onChange={wordChange} checked={form.data.allowedTypes.word} type="checkbox" id="newUploadSlotWord" className="form-check-input" />
                <label htmlFor="newUploadSlotWord" className="form-check-label">Word Document</label>
              </div>
              <div className="form-check">
                <input onChange={excelChange} checked={form.data.allowedTypes.excel} type="checkbox" id="newUploadSlotExcel" className="form-check-input" />
                <label htmlFor="newUploadSlotExcel" className="form-check-label">Excel Document</label>
              </div>
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={form.data.optional} type="checkbox" id="newUploadSlotOptional" className="form-check-input" />
                <label htmlFor="newUploadSlotOptional" className="form-check-label">Optional</label>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-secondary" disabled={!valid || form.saveState === 'processing'}>Add New Text Box</button>
              {form.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {form.saveState === 'error' && <span className="text-danger ms-2">{form.errorMessage ? form.errorMessage : 'Error'}</span>}
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
