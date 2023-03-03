import type { NewSubmissionWithCourseAndAssignments } from '@/services/administrators/newSubmissionService';

export type State = {
  newSubmission?: NewSubmissionWithCourseAndAssignments;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: NewSubmissionWithCourseAndAssignments }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, newSubmission: action.payload, error: false, errorCode: undefined };
    case 'LOAD_DATA_FAILED':
      return { ...state, newSubmission: undefined, error: true, errorCode: action.payload };
  }
};

export const initialState: State = {
  error: false,
};
