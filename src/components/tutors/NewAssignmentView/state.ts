import type { NewAssignmentWithUnitAndChildren } from '@/services/tutors/newAssignmentService';

export type State = {
  newAssignment?: NewAssignmentWithUnitAndChildren;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_ASSIGNMENT_SUCCEEDED'; payload: NewAssignmentWithUnitAndChildren }
  | { type: 'LOAD_ASSIGNMENT_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ASSIGNMENT_SUCCEEDED':
      return { ...state, newAssignment: action.payload, error: false, errorCode: undefined };
    case 'LOAD_ASSIGNMENT_FAILED': {
      return { ...state, newAssignment: undefined, error: true, errorCode: action.payload };
    }
  }
};
