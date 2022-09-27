export type NewSubmissionReturn = {
  /** uuid */
  submissionReturnId: string;
  /** uuid */
  unitId: string;
  returned: Date;
  completed: Date | null;
};

// what we get from the back end
export type RawNewSubmissionReturn = {
  /** uuid */
  submissionReturnId: string;
  /** uuid */
  unitId: string;
  /** string date */
  returned: string;
  /** string date */
  completed: string | null;
};
