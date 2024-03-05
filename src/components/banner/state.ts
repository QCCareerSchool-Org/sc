import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { School } from '@/domain/school';
import type { Student } from '@/domain/student/student';

type Data = Student & {
  enrollments: Array<Enrollment & {
    course: Course & {
      school: School;
    };
  }>;
};

export type State = {
  data?: Data;
  error: boolean;
  errorCode?: number;
};

export type Action =
| { type: 'LOAD_DATA_SUCCEEDED'; payload: Data }
| { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, data: action.payload, error: false, errorCode: undefined };
    case 'LOAD_DATA_FAILED':
      return { ...state, data: undefined, error: true, errorCode: action.payload };
  }
};

export const initialState: State = {
  error: false,
};
