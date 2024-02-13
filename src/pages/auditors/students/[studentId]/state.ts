import type { Student } from '@/domain/auditor/student';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';

export type StudentData = Student & {
  enrollments: Array<Enrollment & {
    course: Course;
  }>;
};

export type State = {
  student?: StudentData;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: StudentData }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, student: action.payload };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};

export const initialState: State = {
  error: false,
};
