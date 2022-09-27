import type { NewSubmission } from '@/domain/newSubmission';
import type { NewSubmissionWithEnrollmentAndAssignments } from '@/services/tutors/newUnitService';

export type State = {
  newSubmission?: NewSubmissionWithEnrollmentAndAssignments;
  error: boolean;
  errorCode?: number;
  feedbackForm: {
    file: File | null;
    errorMessage?: string;
    progress: number;
  };
  returnForm: {
    message: string;
  };
  processingState: 'idle' | 'uploading' | 'upload error' | 'deleting' | 'delete error' | 'closing' | 'close error' | 'returning' | 'return error';
  errorMessage?: string;
};

export type Action =
  | { type: 'LOAD_UNIT_SUCCEEDED'; payload: NewSubmissionWithEnrollmentAndAssignments }
  | { type: 'LOAD_UNIT_FAILED'; payload?: number }
  | { type: 'FILE_CHANGED'; payload: File }
  | { type: 'MESSAGE_CHANGED'; payload: string }
  | { type: 'CLOSE_UNIT_STARTED' }
  | { type: 'CLOSE_UNIT_SUCCEEDED'; payload: NewSubmission }
  | { type: 'CLOSE_UNIT_FAILED'; payload?: string }
  | { type: 'RETURN_UNIT_STARTED' }
  | { type: 'RETURN_UNIT_SUCCEEDED'; payload: NewSubmission }
  | { type: 'RETURN_UNIT_FAILED'; payload?: string }
  | { type: 'UPLOAD_FEEDBACK_STARTED' }
  | { type: 'UPLOAD_FEEDBACK_PROGRESSED'; payload: number }
  | { type: 'UPLOAD_FEEDBACK_SUCCEEDED'; payload: NewSubmission }
  | { type: 'UPLOAD_FEEDBACK_FAILED'; payload?: string }
  | { type: 'DELETE_FEEDBACK_STARTED' }
  | { type: 'DELETE_FEEDBACK_SUCCEEDED'; payload: NewSubmission }
  | { type: 'DELETE_FEEDBACK_FAILED'; payload?: string };

export const initialState: State = {
  error: false,
  feedbackForm: {
    file: null,
    progress: 0,
  },
  returnForm: {
    message: '',
  },
  processingState: 'idle',
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UNIT_SUCCEEDED':
      return { ...state, newSubmission: action.payload, error: false, errorCode: undefined };
    case 'LOAD_UNIT_FAILED':
      return { ...state, newSubmission: undefined, error: true, errorCode: action.payload };
    case 'FILE_CHANGED':
      if (action.payload.size > 33_554_432) {
        return {
          ...state,
          feedbackForm: { ...state.feedbackForm, file: null, errorMessage: 'File is too large' },
        };
      }
      if (!action.payload.type.startsWith('audio/')) {
        return {
          ...state,
          feedbackForm: { ...state.feedbackForm, file: null, errorMessage: 'Invalid file type' },
        };
      }
      return {
        ...state,
        feedbackForm: { ...state.feedbackForm, file: action.payload, errorMessage: undefined },
      };
    case 'MESSAGE_CHANGED':
      return {
        ...state,
        returnForm: { ...state.returnForm, message: action.payload },
      };
    case 'CLOSE_UNIT_STARTED':
      return { ...state, processingState: 'closing', errorMessage: undefined };
    case 'CLOSE_UNIT_SUCCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return { ...state, newSubmission: { ...state.newSubmission, ...action.payload }, processingState: 'idle' };
    case 'CLOSE_UNIT_FAILED':
      return { ...state, processingState: 'close error', errorMessage: action.payload };
    case 'RETURN_UNIT_STARTED':
      return { ...state, processingState: 'returning', errorMessage: undefined };
    case 'RETURN_UNIT_SUCCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return { ...state, newSubmission: { ...state.newSubmission, ...action.payload }, processingState: 'idle' };
    case 'RETURN_UNIT_FAILED':
      return { ...state, processingState: 'return error', errorMessage: action.payload };
    case 'UPLOAD_FEEDBACK_STARTED':
      return {
        ...state,
        feedbackForm: { ...state.feedbackForm, progress: 0 },
        processingState: 'uploading',
        errorMessage: undefined,
      };
    case 'UPLOAD_FEEDBACK_PROGRESSED':
      return {
        ...state,
        feedbackForm: { ...state.feedbackForm, progress: action.payload },
      };
    case 'UPLOAD_FEEDBACK_SUCCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return {
        ...state,
        newSubmission: { ...state.newSubmission, ...action.payload },
        feedbackForm: { ...state.feedbackForm, progress: 100 },
        processingState: 'idle',
      };
    case 'UPLOAD_FEEDBACK_FAILED':
      return { ...state, processingState: 'upload error', errorMessage: action.payload };
    case 'DELETE_FEEDBACK_STARTED':
      return { ...state, processingState: 'deleting', errorMessage: undefined };
    case 'DELETE_FEEDBACK_SUCCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return { ...state, newSubmission: { ...state.newSubmission, ...action.payload }, processingState: 'idle' };
    case 'DELETE_FEEDBACK_FAILED':
      return { ...state, processingState: 'delete error', errorMessage: action.payload };
  }
};
