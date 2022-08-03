import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';
import type { StudentWithCountryProvinceAndEnrollments } from '@/services/students/studentService';
import type { T2202ReceiptWithEnrollmentWithCourse } from '@/services/students/t2202ReceiptService';

export type State = {
  student?: StudentWithCountryProvinceAndEnrollments;
  t2202Receipts?: T2202ReceiptWithEnrollmentWithCourse[];
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
  enrollmentsWithForms?: Array<Enrollment & { course: Course }>;
  recentEnrollment: boolean;
  error: boolean;
  errorCode?: number;
};

type LoadDataPayload = {
  student: StudentWithCountryProvinceAndEnrollments;
  t2202Receipts: T2202ReceiptWithEnrollmentWithCourse[];
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: LoadDataPayload }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      if (action.payload.crmStudent && action.payload.crmStudent.enrollments.length === 0) {
        return {
          ...state,
          error: true,
        };
      }
      let recentEnrollment = false;
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const latestEnrollmentDate = action.payload.student.enrollments.reduce((prev, cur) => {
        return (cur.enrollmentDate !== null && cur.enrollmentDate > prev) ? cur.enrollmentDate : prev;
      }, new Date(Date.UTC(1900, 0, 0)));
      recentEnrollment = latestEnrollmentDate >= oneYearAgo;
      return {
        ...initialState,
        student: action.payload.student,
        t2202Receipts: action.payload.t2202Receipts,
        crmStudent: action.payload.crmStudent,
        enrollmentsWithForms: action.payload.student.enrollments.filter(e => !e.onHold && e.enrollmentDate !== null),
        recentEnrollment,
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};

export const initialState: State = {
  recentEnrollment: false,
  error: false,
};
