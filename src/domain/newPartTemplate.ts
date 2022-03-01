export type NewPartTemplate = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewPartTemplate = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
