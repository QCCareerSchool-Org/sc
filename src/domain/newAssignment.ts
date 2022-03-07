export type NewAssignment = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

// what we get from the back end
export type RawNewAssignment = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
