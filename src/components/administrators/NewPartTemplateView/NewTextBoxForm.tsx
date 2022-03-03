import { FormEventHandler, ReactElement, useEffect, useReducer } from 'react';

import type { NewTextBoxSubmitFunction } from '.';
import { Spinner } from '@/components/Spinner';

type FormState = {
  data: {
    description: string;
    points: number;
    lines: string;
    order: number;
    optional: boolean;
  };
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
  data: {
    description: '',
    points: 1,
    lines: '',
    order: 0,
    optional: false,
  },
  saveState: 'idle',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'DESCRIPTION_UPDATED':
      return { ...state, data: { ...state.data, description: action.payload } };
    case 'POINTS_UPDATED':
      return { ...state, data: { ...state.data, points: action.payload } };
    case 'LINES_UPDATED':
      return { ...state, data: { ...state.data, lines: action.payload } };
    case 'ORDER_UPDATED':
      return { ...state, data: { ...state.data, order: action.payload } };
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
  submit: NewTextBoxSubmitFunction;
};

export const NewTextBoxForm = ({ nextOrder, submit }: Props): ReactElement => {
  const [ form, formDispatch ] = useReducer(formReducer, { ...formInitialState, data: { ...formInitialState.data, order: nextOrder } });

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

  const valid = !isNaN(form.data.points)
    && form.data.points >= 1
    && (form.data.lines === '' || !isNaN(parseInt(form.data.lines, 10)))
    && !isNaN(form.data.order)
    && form.data.order >= 0;

  const formSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (!valid) {
      return;
    }
    formDispatch({ type: 'SAVE_STARTED' });
    submit({
      description: form.data.description || null,
      points: form.data.points,
      lines: form.data.lines ? parseInt(form.data.lines, 10) : null,
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
      <div id="newTextBoxCard" className="card">
        <div className="card-body">
          <h3 className="h5">New Text Box</h3>
          <form onSubmit={formSubmit}>
            <div className="formGroup">
              <label htmlFor="newTextBoxDescription" className="form-label">Description</label>
              <textarea onChange={descriptionChange} value={form.data.description} id="newTextBoxDescription" rows={5} className="form-control" placeholder="(none)" aria-describedby="newTextBoxDescriptionHelp" />
              <div id="newTextBoxDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxPoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={form.data.points} type="number" id="newTextBoxPoints" className="form-control" min={1} aria-describedby="newTextBoxPointsHelp" required />
              <div id="newTextBoxPointsHelp" className="form-text">The maximum mark for the text box</div>
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxLines" className="form-label">Lines</label>
              <input onChange={linesChange} value={form.data.lines} type="number" id="newTextBoxLines" className="form-control" min={1} placeholder="(default)" aria-describedby="newTextBoxLinesHelp" />
              <div id="newTextBoxLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={form.data.order} type="number" id="newTextBoxOrder" className="form-control" min={0} required aria-describedby="newTextBoxOrderHelp" />
              <div id="newTextBoxOrderHelp" className="form-text">The order in which the text box should appear</div>
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={form.data.optional} type="checkbox" id="newTextBoxOptional" className="form-check-input" />
                <label htmlFor="newTextBoxOptional" className="form-check-label">Optional</label>
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
        .form-text { font-size: 0.75rem; }
      `}</style>
    </>
  );
};
