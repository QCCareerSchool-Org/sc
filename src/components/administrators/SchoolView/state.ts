import type { SchoolWithCourses } from '@/services/administrators';

export type State = {
  school?: SchoolWithCourses;
  error: boolean;
};

type Action =
  | { type: 'SCHOOL_LOAD_SUCCEEDED'; payload: SchoolWithCourses }
  | { type: 'SCHOOL_LOAD_FAILED' };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SCHOOL_LOAD_SUCCEEDED':
      return { ...state, school: action.payload, error: false };
    case 'SCHOOL_LOAD_FAILED':
      return { ...state, error: true };
  }
};
