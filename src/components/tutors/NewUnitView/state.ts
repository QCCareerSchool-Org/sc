import type { NewUnit } from '@/domain/newUnit';
import type { NewUnitWithEnrollmentAndAssignments } from '@/services/tutors/newUnitService';

export type State = {
  newUnit?: NewUnitWithEnrollmentAndAssignments;
  error: boolean;
  errorCode?: number;
  feedbackFile?: File;
  progress: number;
  processingState: 'idle' | 'uploading' | 'upload error' | 'closing' | 'close error' | 'returning' | 'return error';
  errorMessage?: string;
};

export type Action =
  | { type: 'LOAD_UNIT_SUCCEEDED'; payload: NewUnitWithEnrollmentAndAssignments }
  | { type: 'LOAD_UNIT_FAILED'; payload?: number }
  | { type: 'CLOSE_UNIT_STARTED' }
  | { type: 'CLOSE_UNIT_SUCCEEDED'; payload: NewUnit }
  | { type: 'CLOSE_UNIT_FAILED'; payload?: string }
  | { type: 'RETURN_UNIT_STARTED' }
  | { type: 'RETURN_UNIT_SUCCEEDED'; payload: NewUnit }
  | { type: 'RETURN_UNIT_FAILED'; payload?: string }
  | { type: 'UPLOAD_FEEDBACK_STARTED' }
  | { type: 'UPLOAD_FEEDBACK_PROGRESSED'; payload: number }
  | { type: 'UPLOAD_FEEDBACK_SUCCEEDED'; payload: NewUnit }
  | { type: 'UPLOAD_FEEDBACK_FAILED'; payload?: string };

export const initialState: State = {
  error: false,
  processingState: 'idle',
  progress: 0,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UNIT_SUCCEEDED':
      return { ...state, newUnit: action.payload, error: false, errorCode: undefined };
    case 'LOAD_UNIT_FAILED':
      return { ...state, newUnit: undefined, error: true, errorCode: action.payload };
    case 'CLOSE_UNIT_STARTED':
      return { ...state, processingState: 'closing', errorMessage: undefined };
    case 'CLOSE_UNIT_SUCCEEDED':
      if (!state.newUnit) {
        throw Error('newUnit is undefined');
      }
      return { ...state, newUnit: { ...state.newUnit, ...action.payload }, processingState: 'idle' };
    case 'CLOSE_UNIT_FAILED':
      return { ...state, processingState: 'close error', errorMessage: action.payload };
    case 'RETURN_UNIT_STARTED':
      return { ...state, processingState: 'returning', errorMessage: undefined };
    case 'RETURN_UNIT_SUCCEEDED':
      if (!state.newUnit) {
        throw Error('newUnit is undefined');
      }
      return { ...state, newUnit: { ...state.newUnit, ...action.payload }, processingState: 'idle' };
    case 'RETURN_UNIT_FAILED':
      return { ...state, processingState: 'return error', errorMessage: action.payload };
    case 'UPLOAD_FEEDBACK_STARTED':
      return { ...state, processingState: 'uploading', errorMessage: undefined };
    case 'UPLOAD_FEEDBACK_PROGRESSED':
      return { ...state, progress: action.payload };
    case 'UPLOAD_FEEDBACK_SUCCEEDED':
      if (!state.newUnit) {
        throw Error('newUnit is undefined');
      }
      return { ...state, newUnit: { ...state.newUnit, ...action.payload }, processingState: 'idle', progress: 100 };
    case 'UPLOAD_FEEDBACK_FAILED':
      return { ...state, processingState: 'upload error', errorMessage: action.payload };
  }
};
