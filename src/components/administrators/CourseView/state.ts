import type { CourseWithUnits } from '@/services/administrators';

export type State = {
  course?: CourseWithUnits;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'COURSE_LOAD_SUCCEEDED'; payload: CourseWithUnits }
  | { type: 'COURSE_LOAD_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'COURSE_LOAD_SUCCEEDED':
      return { ...state, course: action.payload, error: false };
    case 'COURSE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
