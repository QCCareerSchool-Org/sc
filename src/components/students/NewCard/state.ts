import type { CRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { CRMEnrollmentWithCourse } from '@/services/students/crmEnrollmentService';

export type State = {
  enrollments?: CRMEnrollmentWithCourse[];
  form: {
    data: {
      enrollmentId: string;
      updateAll: boolean;
    };
    courses: Array<{ enrollmentId: string; courseName: string }>;
    currencyCode: string;
    processingState: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: CRMEnrollmentWithCourse[] }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'ENROLLMENT_ID_CHANGED'; payload: string }
  | { type: 'UPDATE_ALL_CHANGED'; payload: boolean }
  | { type: 'ADD_PAYMENT_METHOD_STARTED' }
  | { type: 'ADD_PAYMENT_METHOD_SUCEEDED'; payload: CRMPaymentMethod }
  | { type: 'ADD_PAYMENT_METHOD_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      if (action.payload.length === 0) {
        return {
          ...state,
          error: true,
        };
      }
      return {
        ...initialState,
        enrollments: action.payload,
        form: {
          ...initialState.form,
          data: {
            ...initialState.form.data,
            enrollmentId: action.payload[0].enrollmentId.toString(), // pick first-available enrollmentId
          },
          courses: action.payload.map(e => ({ enrollmentId: e.enrollmentId.toString(), courseName: e.course.name })),
          currencyCode: action.payload[0].currency.code,
        },
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'ENROLLMENT_ID_CHANGED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, enrollmentId: action.payload },
        },
      };
    case 'UPDATE_ALL_CHANGED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, updateAll: action.payload },
        },
      };
    case 'ADD_PAYMENT_METHOD_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'processing', errorMessage: undefined },
      };
    case 'ADD_PAYMENT_METHOD_SUCEEDED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'success',
        },
      };
    case 'ADD_PAYMENT_METHOD_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'error',
          errorMessage: action.payload,
        },
      };
  }
};

export const initialState: State = {
  form: {
    data: {
      enrollmentId: '',
      updateAll: false,
    },
    courses: [],
    currencyCode: 'USD',
    processingState: 'idle',
  },
  error: false,
};
