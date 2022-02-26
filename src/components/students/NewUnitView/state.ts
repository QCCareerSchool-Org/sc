import { NewUnitWithAssignments } from '@/services/students';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export type State = {
  unit?: NewUnitWithAssignments;
  error: boolean;
  submit: ProcessingState;
  submitErrorMessage?: string;
  skip: ProcessingState;
  skipErrorMessage?: string;
};

export type Action =
  | { type: 'UNIT_LOAD_SUCEEDED'; payload: NewUnitWithAssignments }
  | { type: 'UNIT_LOAD_FAILED' }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_SUCCEEDED' }
  | { type: 'SUBMIT_FAILED'; payload: string }
  | { type: 'SKIP_STARTED' }
  | { type: 'SKIP_SUCEEDED' }
  | { type: 'SKIP_FAILED'; payload: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UNIT_LOAD_SUCEEDED':
      return {
        ...state,
        unit: action.payload,
        error: false,
      };
    case 'UNIT_LOAD_FAILED':
      return {
        ...state,
        error: true,
      };
    case 'SUBMIT_STARTED':
      return {
        ...state,
        submit: 'processing',
        submitErrorMessage: undefined,
      };
    case 'SUBMIT_SUCCEEDED':
      if (!state.unit) {
        return state;
      }
      return {
        ...state,
        unit: {
          ...state.unit,
          submitted: new Date(),
        },
        submit: 'success',
      };
    case 'SUBMIT_FAILED':
      return {
        ...state,
        submit: 'error',
        submitErrorMessage: action.payload,
      };
    case 'SKIP_STARTED':
      return {
        ...state,
        skip: 'processing',
        skipErrorMessage: undefined,
      };
    case 'SKIP_SUCEEDED':
      if (!state.unit) {
        return state;
      }
      return {
        ...state,
        unit: {
          ...state.unit,
          skipped: new Date(),
        },
        skip: 'success',
      };
    case 'SKIP_FAILED':
      return {
        ...state,
        skip: 'error',
        skipErrorMessage: action.payload,
      };
  }
};

export const initialState: State = {
  error: false,
  submit: 'idle',
  skip: 'idle',
};
