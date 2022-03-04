import { useRouter } from 'next/router';
import { FormEventHandler, ReactElement, useEffect, useReducer, useRef } from 'react';

import { catchError, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';
import type { NewTextBoxSubmitFunction } from '.';
import { Spinner } from '@/components/Spinner';
import { NewTextBoxPayload } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type FormState = {
  data: {
    description: string;
    points: string;
    lines: string;
    order: string;
    optional: boolean;
  };
  validationMessages: {
    description?: string;
    points?: string;
    lines?: string;
    order?: string;
    optional?: string;
  };
  saveState: 'idle' | 'processing' | 'error';
  errorMessage?: string;
};

type FormAction =
  | { type: 'DESCRIPTION_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: string }
  | { type: 'LINES_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: string }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'SAVE_STARTED' }
  | { type: 'SAVE_SUCCEEDED'; payload: { nextOrder: number } }
  | { type: 'SAVE_FAILED'; payload: string };

const formInitialState: FormState = {
  data: {
    description: '',
    points: '1',
    lines: '',
    order: '0',
    optional: false,
  },
  validationMessages: {},
  saveState: 'idle',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'DESCRIPTION_UPDATED':
      return { ...state, data: { ...state.data, description: action.payload } };
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
    case 'LINES_UPDATED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const parsedLines = parseInt(action.payload, 10);
        if (isNaN(parsedLines)) {
          validationMessage = 'Invalid number';
        } else if (parsedLines < 1) {
          validationMessage = 'Cannot be less than one';
        } else if (parsedLines > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        data: { ...state.data, lines: action.payload },
        validationMessages: { ...state.validationMessages, lines: validationMessage },
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
  submit: NewTextBoxSubmitFunction;
};

export const NewTextBoxForm = ({ nextOrder, submit }: Props): ReactElement => {
  const router = useRouter();
  const [ formState, formDispatch ] = useReducer(formReducer, { ...formInitialState, data: { ...formInitialState.data, order: nextOrder.toString() } });

  useEffect(() => {
    formDispatch({ type: 'ORDER_UPDATED', payload: nextOrder.toString() });
  }, [ nextOrder ]);

  const submit$ = useRef(new Subject<NewTextBoxPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    submit$.current.pipe(
      tap(() => formDispatch({ type: 'SAVE_STARTED' })),
      exhaustMap(payload => submit(payload)),
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
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, submit, nextOrder ]);

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'DESCRIPTION_UPDATED', payload: target.value });
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'POINTS_UPDATED', payload: target.value });
  };

  const linesChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'LINES_UPDATED', payload: target.value });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    formDispatch({ type: 'ORDER_UPDATED', payload: target.value });
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
      description: formState.data.description || null,
      points: parseInt(formState.data.points, 10),
      lines: formState.data.lines ? parseInt(formState.data.lines, 10) : null,
      order: parseInt(formState.data.order, 10),
      optional: formState.data.optional,
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
              <textarea onChange={descriptionChange} value={formState.data.description} id="newTextBoxDescription" rows={5} className={`form-control ${formState.validationMessages.description ? 'is-invalid' : ''}`} placeholder="(none)" aria-describedby="newTextBoxDescriptionHelp" />
              <div id="newTextBoxDescriptionHelp" className="form-text">A description of what should be enterered into the text box</div>
              {formState.validationMessages.description && <div className="invalid-feedback">{formState.validationMessages.description}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxPoints" className="form-label">Points <span className="text-danger">*</span></label>
              <input onChange={pointsChange} value={formState.data.points} type="number" id="newTextBoxPoints" className={`form-control ${formState.validationMessages.points ? 'is-invalid' : ''}`} min={0} max={127} aria-describedby="newTextBoxPointsHelp" required />
              <div id="newTextBoxPointsHelp" className="form-text">The maximum mark for the text box</div>
              {formState.validationMessages.points && <div className="invalid-feedback">{formState.validationMessages.points}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxLines" className="form-label">Lines</label>
              <input onChange={linesChange} value={formState.data.lines} type="number" id="newTextBoxLines" className={`form-control ${formState.validationMessages.lines ? 'is-invalid' : ''}`} min={1} max={127} placeholder="(default)" aria-describedby="newTextBoxLinesHelp" />
              <div id="newTextBoxLinesHelp" className="form-text">The size of the text box (for display purposes only)</div>
              {formState.validationMessages.lines && <div className="invalid-feedback">{formState.validationMessages.lines}</div>}
            </div>
            <div className="formGroup">
              <label htmlFor="newTextBoxOrder" className="form-label">Order <span className="text-danger">*</span></label>
              <input onChange={orderChange} value={formState.data.order} type="number" id="newTextBoxOrder" className={`form-control ${formState.validationMessages.order ? 'is-invalid' : ''}`} min={0} max={127} required aria-describedby="newTextBoxOrderHelp" />
              <div id="newTextBoxOrderHelp" className="form-text">The order in which the text box should appear</div>
              {formState.validationMessages.order && <div className="invalid-feedback">{formState.validationMessages.order}</div>}
            </div>
            <div className="formGroup">
              <div className="form-check">
                <input onChange={optionalChange} checked={formState.data.optional} type="checkbox" id="newTextBoxOptional" className={`form-check-input ${formState.validationMessages.optional ? 'is-invalid' : ''}`} />
                <label htmlFor="newTextBoxOptional" className="form-check-label">Optional</label>
                {formState.validationMessages.optional && <div className="invalid-feedback">{formState.validationMessages.optional}</div>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" disabled={!valid || formState.saveState === 'processing'}>Save</button>
              {formState.saveState === 'processing' && <div className="ms-2"><Spinner /></div>}
              {formState.saveState === 'error' && <span className="text-danger ms-2">{formState.errorMessage ? formState.errorMessage : 'Error'}</span>}
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
