import type { SchoolWithCourses } from '@/services/administrators/schoolService';

export type State = {
  school?: SchoolWithCourses;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'SCHOOL_LOAD_SUCCEEDED'; payload: SchoolWithCourses }
  | { type: 'SCHOOL_LOAD_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SCHOOL_LOAD_SUCCEEDED':
      return { ...state, school: action.payload, error: false };
    case 'SCHOOL_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
