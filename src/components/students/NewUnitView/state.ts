import { NewUnitWithCourseAndChildren } from '@/services/students';

export type State = {
  unit?: NewUnitWithCourseAndChildren;
  error: boolean;
  errorCode?: number;
  processingState: 'idle' | 'submitting' | 'skipping' | 'submit error' | 'skip error';
  errorMessage?: string;
};

export type Action =
  | { type: 'UNIT_LOAD_SUCEEDED'; payload: NewUnitWithCourseAndChildren }
  | { type: 'UNIT_LOAD_FAILED'; payload?: number }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_SUCCEEDED' }
  | { type: 'SUBMIT_FAILED'; payload: string }
  | { type: 'SKIP_STARTED' }
  | { type: 'SKIP_SUCEEDED' }
  | { type: 'SKIP_FAILED'; payload: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UNIT_LOAD_SUCEEDED':
      return { ...state, unit: action.payload, error: false };
    case 'UNIT_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'SUBMIT_STARTED':
      return { ...state, processingState: 'submitting', errorMessage: undefined };
    case 'SUBMIT_SUCCEEDED':
      if (!state.unit) {
        throw Error('unit is undefined');
      }
      return {
        ...state,
        unit: { ...state.unit, submitted: new Date() },
        processingState: 'idle',
      };
    case 'SUBMIT_FAILED':
      return { ...state, processingState: 'submit error', errorMessage: action.payload };
    case 'SKIP_STARTED':
      return { ...state, processingState: 'skipping', errorMessage: undefined };
    case 'SKIP_SUCEEDED':
      if (!state.unit) {
        throw Error('unit is undefined');
      }
      return {
        ...state,
        unit: { ...state.unit, skipped: new Date() },
        processingState: 'idle',
      };
    case 'SKIP_FAILED':
      return {
        ...state, processingState: 'skip error', errorMessage: action.payload,
      };
  }
};

export const initialState: State = {
  error: false,
  processingState: 'idle',
};
