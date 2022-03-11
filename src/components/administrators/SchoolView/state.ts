import type { SchoolWithCourses } from '@/services/administrators/schoolService';

export type State = {
  school?: SchoolWithCourses;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_SCHOOL_SUCCEEDED'; payload: SchoolWithCourses }
  | { type: 'LOAD_SCHOOL_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_SCHOOL_SUCCEEDED':
      return { ...state, school: action.payload, error: false };
    case 'LOAD_SCHOOL_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
