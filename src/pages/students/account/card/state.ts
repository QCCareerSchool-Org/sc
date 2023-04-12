import type { CRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';

export type State = {
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
  form: {
    data: {
      enrollmentId: string;
      updateAll: boolean;
    };
    processingState: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
  currencyCode: string;
  currencyName: string;
  allSameCurrency: boolean;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: CRMStudentWithCountryProvinceAndEnrollments }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'ENROLLMENT_ID_CHANGED'; payload: string }
  | { type: 'UPDATE_ALL_CHANGED'; payload: boolean }
  | { type: 'CARD_DATA_CHANGED' }
  | { type: 'ADD_PAYMENT_METHOD_STARTED' }
  | { type: 'ADD_PAYMENT_METHOD_SUCEEDED'; payload: CRMPaymentMethod }
  | { type: 'ADD_PAYMENT_METHOD_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      if (action.payload.enrollments.length === 0) {
        return {
          ...state,
          error: true,
        };
      }
      return {
        ...initialState,
        crmStudent: action.payload,
        form: {
          ...initialState.form,
          data: {
            ...initialState.form.data,
            enrollmentId: action.payload.enrollments[0].enrollmentId.toString(), // pick first-available enrollmentId
          },
        },
        currencyCode: action.payload.enrollments[0].currency.code,
        currencyName: action.payload.enrollments[0].currency.name,
        allSameCurrency: action.payload.enrollments.every(e => e.currencyId === action.payload.enrollments[0].currencyId),
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'ENROLLMENT_ID_CHANGED': {
      if (typeof state.crmStudent === 'undefined') {
        throw Error('crmStudent is undefined');
      }
      const enrollment = state.crmStudent.enrollments.find(e => e.enrollmentId.toString() === action.payload);
      if (typeof enrollment === 'undefined') {
        throw Error('enrollment not found');
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, enrollmentId: action.payload },
        },
        currencyCode: enrollment.currency.code,
        currencyName: enrollment.currency.name,
      };
    }
    case 'UPDATE_ALL_CHANGED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, updateAll: action.payload },
        },
      };
    case 'CARD_DATA_CHANGED':
      return state;
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
    processingState: 'idle',
  },
  currencyCode: 'USD',
  currencyName: 'US dollars',
  allSameCurrency: false,
  error: false,
};
