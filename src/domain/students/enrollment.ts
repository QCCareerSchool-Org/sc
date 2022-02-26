export type Enrollment = {
  enrollmentId: number;
  courseId: number;
  studentNumber: number;
  tutorId: number | null;
  maxAssignments: number | null;
  graduated: boolean;
  assignmentsDisabled: boolean;
  quizzesDisabled: boolean;
  onHold: boolean;
  holdReason: string | null;
  currencyCode: string;
  courseCost: number;
  amountPaid: number;
  monthlyInstallment: number | null;
  enrollmentDate: Date | null;
  fastTrack: boolean;
  paymentsDisabled: boolean;
};

export type RawEnrollment = {
  enrollmentId: number;
  courseId: number;
  studentNumber: number;
  tutorId: number | null;
  maxAssignments: number | null;
  graduated: boolean;
  assignmentsDisabled: boolean;
  quizzesDisabled: boolean;
  onHold: boolean;
  holdReason: string | null;
  currencyCode: string;
  courseCost: number;
  amountPaid: number;
  monthlyInstallment: number | null;
  enrollmentDate: string | null;
  fastTrack: boolean;
  paymentsDisabled: boolean;
};
