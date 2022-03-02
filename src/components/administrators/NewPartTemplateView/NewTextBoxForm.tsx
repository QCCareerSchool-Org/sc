import { FormEventHandler, ReactElement, useEffect, useReducer } from 'react';

import type { NewTextBoxSubmitFunction } from '.';
import { Spinner } from '@/components/Spinner';

type FormState = {
  description: string;
  points: number;
  lines: string;
  order: number;
  optional: boolean;
  saveState: 'idle' | 'processing' | 'error';
  errorMessage?: string;
};

type FormAction =
  | { type: 'DESCRIPTION_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: number }
  | { type: 'LINES_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: number }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'SAVE_STARTED' }
  | { type: 'SAVE_SUCCEEDED'; payload: { nextOrder: number } }
  | { type: 'SAVE_FAILED'; payload: string };

const formInitialState: FormState = {
  description: '',
  points: 1,
  lines: '',
  order: 0,
  optional: false,
  saveState: 'idle',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'DESCRIPTION_UPDATED':
      return { ...state, description: action.payload };
    case 'POINTS_UPDATED':
      return { ...state, points: action.payload };
    case 'LINES_UPDATED':
      return { ...state, lines: action.payload };
    case 'ORDER_UPDATED':
      return { ...state, order: action.payload };
    case 'OPTIONAL_UPDATED':
      return { ...state, optional: action.payload };
    case 'SAVE_STARTED':
      return { ...state, saveState: 'processing' };
    case 'SAVE_SUCCEEDED':
      return { ...state, ...formInitialState, order: action.payload.nextOrder };
    case 'SAVE_FAILED':
      return { ...state, saveState: 'error', errorMessage: action.payload };
  }
};

type Props = {
  nextOrder: number;
  submit: NewTextBoxSubmitFunction;
};

export const NewTextBoxForm = ({ nextOrder, submit }: Props): ReactElement => {
  const [ form, formDispatch ] = useReducer(formReducer, { ...formInitialState, order: nextOrder });

  useEffect(() => {
    formDispatch({ type: 'ORDER_UPDATED', payload: nextOrder });
  }, [ nextOrder ]);

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'DESCRIPTION_UPDATED', payload: target.value });
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'POINTS_UPDATED', payload: Math.max(parseInt(target.value, 10), 1) });
  };

  const linesChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'LINES_UPDATED', payload: target.value });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'ORDER_UPDATED', payload: Math.max(parseInt(target.value, 10), 0) });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!form.description || isNaN(form.points) || isNaN(form.order)) {
      return;
    }
    formDispatch({ type: 'SAVE_STARTED' });
    submit({
      description: form.description,
      points: form.points,
      lines: form.lines ? parseInt(form.lines, 10) : null,
      order: form.order,
      optional: form.optional,
    }).then(() => {
      formDispatch({ type: 'SAVE_SUCCEEDED', payload: { nextOrder } });
    }).catch(err => {
      formDispatch({ type: 'SAVE_FAILED', payload: err.message });
    });
  };

  return (
    <>
      <div id="newTextBoxCard" className="card">
        <div className="card-body">
          <h3 className="h5">New Text Box</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newTextBoxDescription">Description <span className="text-danger">*</span></label>
              <textarea onChange={descriptionChange} value={form.description} id="newTextBoxDescription" rows={5} className="form-control" required />
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxPoints">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={form.points} type="number" id="newTextBoxPoints" className="form-control" min={1} required />
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxLines">Lines</label>
              <input onChange={linesChange} value={form.lines} type="number" id="newTextBoxLines" className="form-control" min={1} />
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxOrder">Order</label>
              <input onChange={orderChange} value={form.order} type="number" id="newTextBoxOrder" className="form-control" min={0} required />
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={form.optional} type="checkbox" id="newTextBoxOptional" className="form-check-input" />
                <label htmlFor="newTextBoxOptional" className="form-check-label">Optional</label>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-secondary" disabled={form.saveState === 'processing'}>Add New Text Box</button>
              {form.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {form.saveState === 'error' && <span className="text-danger ms-2">{form.errorMessage ? form.errorMessage : 'Error'}</span>}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        #newTextBoxCard { max-width: 600px; }
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};
