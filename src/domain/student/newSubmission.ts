export type NewSubmission = {
  /** uuid */
  submissionId: string;
  enrollmentId: number;
  tutorId: number | null;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  optional: boolean;
  order: number;
  tutorComment: string | null;
  adminComment: string | null;
  submitted: Date | null;
  transferred: Date | null;
  closed: Date | null;
  skipped: boolean;
  responseFilename: string | null;
  responseFilesize: number | null;
  responseMimeTypeId: string | null;
  responseProgress: number | null;
  complete: boolean;
  points: number;
  mark: number | null;
  created: Date;
  modified: Date | null;
};

// what we get from the back end
export type RawNewSubmission = {
  /** uuid */
  submissionId: string;
  enrollmentId: number;
  tutorId: number | null;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  optional: boolean;
  order: number;
  tutorComment: string | null;
  adminComment: string | null;
  submitted: string | null;
  transferred: string | null;
  closed: string | null;
  skipped: boolean;
  responseFilename: string | null;
  responseFilesize: number | null;
  responseMimeTypeId: string | null;
  responseProgress: number | null;
  complete: boolean;
  points: number;
  mark: number | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
