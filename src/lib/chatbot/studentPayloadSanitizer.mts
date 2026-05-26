import type { StudentPayload } from './studentPayload.mjs';
import type { SchoolSlug } from '@/domain/school.js';

interface ChatbotStudentPayload {
  studentId: number;
  firstName: string;
  studentTypeId: string;
  arrears: boolean;
  questionnaire: boolean;
  videoViewed: boolean;
  country: string;
  province: string | null;
  enrollments: ChatbotEnrollmentPayload[];
}

interface ChatbotEnrollmentPayload {
  enrollmentId: number;
  courseId: number;
  studentNumber: number;
  maxAssignments: number | null;
  graduated: boolean;
  onHold: boolean;
  holdReason: string | null;
  currencyCode: string;
  courseCost: number;
  amountPaid: number;
  monthlyInstallment: number | null;
  enrollmentDate: Date | null;
  dueDate: Date | null;
  fastTrack: boolean;
  course: {
    code: string;
    version: number;
    name: string;
    noTutor: boolean;
    submissionType: number;
    school: {
      name: string;
      slug: SchoolSlug;
    };
  };
  submissions: ChatbotSubmissionPayload[];
}

interface ChatbotSubmissionPayload {
  submissionId: string;
  unitLetter: string;
  title: string | null;
  optional: boolean;
  order: number;
  submitted: Date | null;
  transferred: Date | null;
  closed: Date | null;
  skipped: boolean;
  redoId: string | null;
  hasParent: boolean;
  complete: boolean;
  points: number;
  mark: number | null;
  assignments: ChatbotAssignmentPayload[];
}

interface ChatbotAssignmentPayload {
  assignmentId: string;
  assignmentNumber: number;
  title: string | null;
  optional: boolean;
  complete: boolean;
  points: number;
  mark: number | null;
}

export const createChatbotStudentPayload = (student: StudentPayload): ChatbotStudentPayload => {
  return {
    studentId: student.studentId,
    firstName: student.firstName,
    studentTypeId: student.studentTypeId,
    arrears: student.arrears,
    questionnaire: student.questionnaire,
    videoViewed: student.videoViewed,
    country: student.country.name,
    province: student.province?.name ?? null,
    enrollments: student.enrollments.map(enrollment => ({
      enrollmentId: enrollment.enrollmentId,
      courseId: enrollment.courseId,
      studentNumber: enrollment.studentNumber,
      maxAssignments: enrollment.maxAssignments,
      graduated: enrollment.graduated,
      onHold: enrollment.onHold,
      holdReason: enrollment.holdReason,
      currencyCode: enrollment.currencyCode,
      courseCost: enrollment.courseCost,
      amountPaid: enrollment.amountPaid,
      monthlyInstallment: enrollment.monthlyInstallment,
      enrollmentDate: enrollment.enrollmentDate,
      dueDate: enrollment.dueDate,
      fastTrack: enrollment.fastTrack,
      course: {
        code: enrollment.course.code,
        version: enrollment.course.version,
        name: enrollment.course.name,
        noTutor: enrollment.course.noTutor,
        submissionType: enrollment.course.submissionType,
        school: {
          name: enrollment.course.school.name,
          slug: enrollment.course.school.slug,
        },
      },
      submissions: enrollment.submissions.map(submission => ({
        submissionId: submission.submissionId,
        unitLetter: submission.unitLetter,
        title: submission.title,
        optional: submission.optional,
        order: submission.order,
        submitted: submission.submitted,
        transferred: submission.transferred,
        closed: submission.closed,
        skipped: submission.skipped,
        redoId: submission.redoId,
        hasParent: submission.hasParent,
        complete: submission.complete,
        points: submission.points,
        mark: submission.mark,
        assignments: submission.assignments.map(assignment => ({
          assignmentId: assignment.assignmentId,
          assignmentNumber: assignment.assignmentNumber,
          title: assignment.title,
          optional: assignment.optional,
          complete: assignment.complete,
          points: assignment.points,
          mark: assignment.mark,
        })),
      })),
    })),
  };
};
