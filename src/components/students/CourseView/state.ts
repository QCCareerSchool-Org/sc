import type { NewUnit } from '@/domain/newUnit';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

export type State = {
  enrollment?: EnrollmentWithStudentCourseAndUnits;
  form: {
    processingState: 'idle' | 'initializing' | 'initialize error';
    errorMessage?: string;
  };
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
  form: { processingState: 'idle' },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ENROLLMENT_SUCCEEDED':
      return { ...state, enrollment: action.payload, error: false };
    case 'LOAD_ENROLLMENT_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'INITIALIZE_UNIT_STARTED':
      return { ...state, form: { ...state.form, processingState: 'initializing', errorMessage: undefined } };
    case 'INITIALIZE_UNIT_SUCCEEDED':
      if (typeof state.enrollment === 'undefined') {
        throw Error('enrollment is undefined');
      }
      return {
        ...state,
        enrollment: { ...state.enrollment, newUnits: [ ...state.enrollment.newUnits, action.payload ] },
        form: { ...state.form, processingState: 'idle' },
      };
    case 'INITIALIZE_UNIT_FAILED':
      return { ...state, form: { ...state.form, processingState: 'initialize error', errorMessage: action.payload } };
  }
};
