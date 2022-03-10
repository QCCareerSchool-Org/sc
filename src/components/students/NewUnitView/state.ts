import type { NewUnitWithCourseAndChildren } from '@/services/students/newUnitService';

export type State = {
  newUnit?: NewUnitWithCourseAndChildren;
  error: boolean;
  errorCode?: number;
  processingState: 'idle' | 'submitting' | 'skipping' | 'submit error' | 'skip error';
  errorMessage?: string;
};

export type Action =
  | { type: 'LOAD_UNIT_SUCEEDED'; payload: NewUnitWithCourseAndChildren }
  | { type: 'LOAD_UNIT_FAILED'; payload?: number }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_SUCCEEDED' }
  | { type: 'SUBMIT_FAILED'; payload: string }
  | { type: 'SKIP_STARTED' }
  | { type: 'SKIP_SUCEEDED' }
  | { type: 'SKIP_FAILED'; payload: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UNIT_SUCEEDED':
      return { ...state, newUnit: action.payload, error: false };
    case 'LOAD_UNIT_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'SUBMIT_STARTED':
      return { ...state, processingState: 'submitting', errorMessage: undefined };
    case 'SUBMIT_SUCCEEDED':
      if (!state.newUnit) {
        throw Error('newUnit is undefined');
      }
      return {
        ...state,
        newUnit: { ...state.newUnit, submitted: new Date() },
        processingState: 'idle',
      };
    case 'SUBMIT_FAILED':
      return { ...state, processingState: 'submit error', errorMessage: action.payload };
    case 'SKIP_STARTED':
      return { ...state, processingState: 'skipping', errorMessage: undefined };
    case 'SKIP_SUCEEDED':
      if (!state.newUnit) {
        throw Error('newUnit is undefined');
      }
      return {
        ...state,
        newUnit: { ...state.newUnit, skipped: new Date() },
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
