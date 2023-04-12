import type { NewSubmissionWithCourseAndChildren } from '@/services/students/newSubmissionService';

export type State = {
  newSubmission?: NewSubmissionWithCourseAndChildren;
  optionalAssignmentIncomplete: boolean;
  error: boolean;
  errorCode?: number;
  processingState: 'idle' | 'submitting' | 'skipping' | 'submit error' | 'skip error';
  errorMessage?: string;
};

export type Action =
  | { type: 'LOAD_UNIT_SUCEEDED'; payload: NewSubmissionWithCourseAndChildren }
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
      return {
        ...state,
        newSubmission: action.payload,
        optionalAssignmentIncomplete: action.payload.newAssignments.some(a => a.optional && !a.complete),
        error: false,
      };
    case 'LOAD_UNIT_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'SUBMIT_STARTED':
      return { ...state, processingState: 'submitting', errorMessage: undefined };
    case 'SUBMIT_SUCCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return {
        ...state,
        newSubmission: { ...state.newSubmission, submitted: new Date(), skipped: false },
        processingState: 'idle',
      };
    case 'SUBMIT_FAILED':
      return { ...state, processingState: 'submit error', errorMessage: action.payload };
    case 'SKIP_STARTED':
      return { ...state, processingState: 'skipping', errorMessage: undefined };
    case 'SKIP_SUCEEDED':
      if (!state.newSubmission) {
        throw Error('newSubmission is undefined');
      }
      return {
        ...state,
        newSubmission: { ...state.newSubmission, submitted: new Date(), skipped: true },
        processingState: 'idle',
      };
    case 'SKIP_FAILED':
      return {
        ...state, processingState: 'skip error', errorMessage: action.payload,
      };
  }
};

export const initialState: State = {
  optionalAssignmentIncomplete: false,
  error: false,
  processingState: 'idle',
};
