export type NewPart = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewPart = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
