import type { Student } from '@/domain/auditor/student';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';

export type StudentsWithEnrollments = Array<Student & {
  enrollments: Array<Enrollment & {
    course: Course;
  }>;
}>;

export type State = {
  students: StudentsWithEnrollments;
  form: {
    state: 'idle' | 'submitting' | 'success' | 'error';
    errorMessage?: string;
    data: {
      name: string;
      group: string;
    };
  };
};

export type Action =
  | { type: 'FORM_SUBMITTED' }
  | { type: 'FORM_SUCCEEDED'; payload: StudentsWithEnrollments }
  | { type: 'FORM_FAILED'; payload: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FORM_SUBMITTED':
      return { ...state, form: { ...state.form, state: 'submitting', errorMessage: undefined } };
    case 'FORM_SUCCEEDED':
      return { ...state, students: action.payload, form: { ...state.form, state: 'success' } };
    case 'FORM_FAILED':
      return { ...state, form: { ...state.form, state: 'error', errorMessage: action.payload } };
  }
};
