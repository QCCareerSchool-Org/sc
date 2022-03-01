export type NewAssignmentTemplate = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewAssignmentTemplate = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
