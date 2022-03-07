export type NewUnit = {
  /** uuid */
  unitId: string;
  enrollmentId: number;
  tutorId: number | null;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  order: number;
  adminComment: string | null;
  submitted: Date | null;
  skipped: Date | null;
  transferred: Date | null;
  marked: Date | null;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

// what we get from the back end
export type RawNewUnit = {
  /** uuid */
  unitId: string;
  enrollmentId: number;
  tutorId: number | null;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  order: number;
  adminComment: string | null;
  submitted: string | null;
  skipped: string | null;
  transferred: string | null;
  marked: string | null;
  complete: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
