import type { NewUnit } from '@/domain/newUnit';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

export type State = {
  enrollment?: EnrollmentWithStudentCourseAndUnits;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_ENROLLMENT_SUCCEEDED'; payload: EnrollmentWithStudentCourseAndUnits }
  | { type: 'LOAD_ENROLLMENT_FAILED'; payload?: number }
  | { type: 'INITIALIZE_UNIT_STARTED' }
  | { type: 'INITIALIZE_UNIT_SUCCEEDED'; payload: NewUnit }
  | { type: 'INITIALIZE_UNIT_FAILED'; payload?: string };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ENROLLMENT_SUCCEEDED':
      return { ...state, enrollment: action.payload, error: false };
    case 'LOAD_ENROLLMENT_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'INITIALIZE_UNIT_STARTED':
    case 'INITIALIZE_UNIT_SUCCEEDED':
    case 'INITIALIZE_UNIT_FAILED':
      return state;
  }
};
