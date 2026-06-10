import type { Country } from '@/domain/country.js';
import type { Course } from '@/domain/course.js';
import type { Enrollment } from '@/domain/enrollment.js';
import type { Province } from '@/domain/province.js';
import type { School } from '@/domain/school.js';
import type { TransactionType } from '@/domain/student/crm/crmTransaction.js';
import type { NewAssignment } from '@/domain/student/newAssignment.js';
import type { NewSubmission } from '@/domain/student/newSubmission.js';
import type { Student } from '@/domain/student/student.js';
import type { Tutor } from '@/domain/student/tutor.js';

export type StudentPayload = Student & {
  country: Country;
  province: Province | null;
  enrollments: (Enrollment & {
    course: Course & {
      school: School;
    };
    tutor: Tutor | null;
    submissions: (NewSubmission & {
      assignments: NewAssignment[];
    })[];
    transactions: TransactionType[];
  })[];
};

export const isStudentPayload = (u: unknown): u is StudentPayload => {
  // TODO
  return u !== null && typeof u === 'object';
};
