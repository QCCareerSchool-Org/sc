export type EnrollmentStatus = 'W' | 'H' | 'T' | 'G' | 'R' | null;

export type PaymentPlan = 'full' | 'accelerated' | 'extended';

export type PaymentFrequency = 'monthly' | 'weekly' | 'biWeekly';

export type CRMEnrollment = {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  currencyId: number;
  userId: number | null;
  enrollmentDate: Date | null;
  expiryDate: Date | null;
  paymentPlan: PaymentPlan;
  status: EnrollmentStatus;
  statusDate: Date | null;
  gradEmailDate: Date | null;
  gradEmailSkip: boolean;
  cost: number;
  discount: number;
  installment: number;
  noShipping: boolean;
  hideFromShippingList: boolean;
  paymentOverride: boolean;
  paymentFrequency: PaymentFrequency;
  paymentDay: number | null;
  paymentStart: Date | null;
  accountId: number | null;
  // shippingNote is omitted
  preparedDate: Date | null;
  shippedDate: Date | null;
  diploma: boolean;
  diplomaDate: Date | null;
  fastTrack: boolean;
  noStudentCenter: boolean;
  created: Date;
  modified: Date | null;
};

export type RawCRMEnrollment = {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  currencyId: number;
  userId: number | null;
  /** string date */
  enrollmentDate: string | null;
  /** string date */
  expiryDate: string | null;
  paymentPlan: PaymentPlan;
  status: EnrollmentStatus;
  /** string date */
  statusDate: string | null;
  /** string date */
  gradEmailDate: string | null;
  gradEmailSkip: boolean;
  cost: number;
  discount: number;
  installment: number;
  noShipping: boolean;
  hideFromShippingList: boolean;
  paymentOverride: boolean;
  paymentFrequency: PaymentFrequency;
  paymentDay: number | null;
  /** string date */
  paymentStart: string | null;
  accountId: number | null;
  // shippingNote is omitted
  /** string date */
  preparedDate: string | null;
  /** string date */
  shippedDate: string | null;
  diploma: boolean;
  /** string date */
  diplomaDate: string | null;
  fastTrack: boolean;
  noStudentCenter: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
