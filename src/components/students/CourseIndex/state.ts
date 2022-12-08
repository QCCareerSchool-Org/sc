import type { StudentWithCountryProvinceAndEnrollments } from '@/services/students/studentService';

export type State = {
  student?: StudentWithCountryProvinceAndEnrollments;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: StudentWithCountryProvinceAndEnrollments }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, student: action.payload };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
