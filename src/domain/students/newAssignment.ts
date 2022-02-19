export type NewAssignment = {
  /** hex string */
  assignmentId: string;
  /** hex string */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  created: Date;
};
