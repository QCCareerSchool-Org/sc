import type { Student } from '@/domain/auditor/student';
import type { Country } from '@/domain/country';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { Province } from '@/domain/province';
import type { AuditorStudentList } from '@/services/auditors/studentService';

export type StudentData = Student & {
  country: Country;
  province: Province | null;
  enrollments: Array<Enrollment & { course: Course }>;
  groups: string[];
};

export type State = {
  students?: StudentData[];
  form: {
    processingState: 'idle' | 'submitting' | 'success' | 'error';
    errorMessage?: string;
    data: {
      name: string;
      group: string;
      location: string;
    };
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: AuditorStudentList }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'NAME_CHANGED'; payload: string }
  | { type: 'GROUP_CHANGED'; payload: string }
  | { type: 'LOCATION_CHANGED'; payload: string }
  | { type: 'FILTER_STARTED' }
  | { type: 'FILTER_SUCCEEDED'; payload: AuditorStudentList }
  | { type: 'FILTER_FAILED'; payload: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, students: action.payload };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'NAME_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, name: action.payload } } };
    }
    case 'GROUP_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, group: action.payload } } };
    }
    case 'LOCATION_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, location: action.payload } } };
    }
    case 'FILTER_STARTED':
      return { ...state, form: { ...state.form, processingState: 'submitting', errorMessage: undefined } };
    case 'FILTER_SUCCEEDED':
      return { ...state, students: action.payload, form: { ...state.form, processingState: 'success' } };
    case 'FILTER_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
  }
};

export const initialState: State = {
  form: {
    processingState: 'idle',
    data: {
      name: '',
      group: '',
      location: '',
    },
  },
  error: false,
};
