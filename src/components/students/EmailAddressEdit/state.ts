import type { CRMStudent } from '@/domain/student/crm/crmStudent';
import type { Student } from '@/domain/student/student';
import type { CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';
import type { StudentWithCountryProvinceAndEnrollments } from '@/services/students/studentService';

export type State = {
  student?: StudentWithCountryProvinceAndEnrollments;
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
  emailAddress: string;
  form: {
    data: {
      emailAddress: string;
    };
    processingState: 'idle' | 'saving' | 'save error' | 'success';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { student: StudentWithCountryProvinceAndEnrollments; crmStudent?: CRMStudentWithCountryProvinceAndEnrollments } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'EMAIL_ADDRESS_UPDATED'; payload: string }
  | { type: 'UPDATE_EMAIL_ADDRESS_STARTED' }
  | { type: 'UPDATE_EMAIL_ADDRESS_SUCEEDED'; payload: { student: Student; crmStudent?: CRMStudent } }
  | { type: 'UPDATE_EMAIL_ADDRESS_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      const emailAddress = action.payload.crmStudent ? action.payload.crmStudent.emailAddress : action.payload.student.emailAddress ?? '';
      return {
        ...initialState,
        student: action.payload.student,
        crmStudent: action.payload.crmStudent,
        emailAddress,
        form: {
          ...state.form,
          data: {
            emailAddress,
          },
        },
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'EMAIL_ADDRESS_UPDATED': {
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, emailAddress: action.payload },
        },
      };
    }
    case 'UPDATE_EMAIL_ADDRESS_STARTED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'saving',
          errorMessage: undefined,
        },
      };
    case 'UPDATE_EMAIL_ADDRESS_SUCEEDED': {
      if (typeof state.student === 'undefined') {
        throw Error('student is undefined');
      }
      const emailAddress = action.payload.crmStudent ? action.payload.crmStudent.emailAddress : action.payload.student.emailAddress ?? '';
      return {
        ...state,
        student: { ...state.student, ...action.payload.student },
        crmStudent: state.crmStudent ? { ...state.crmStudent, ...action.payload.crmStudent } : state.crmStudent,
        emailAddress,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            emailAddress,
          },
          processingState: 'success',
        },
      };
    }
    case 'UPDATE_EMAIL_ADDRESS_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };
  }
};

export const initialState: State = {
  emailAddress: '',
  form: {
    data: {
      emailAddress: '',
    },
    processingState: 'idle',
  },
  error: false,
};
