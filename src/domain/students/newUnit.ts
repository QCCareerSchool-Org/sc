export type NewUnit = {
  /** hex string */
  unitId: string;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  created: Date;
  assignments: Array<{
    /** hex string */
    assignmentId: string;
    /** hex string */
    unitId: string;
    assignmentNumber: number;
    title: string | null;
    description: string | null;
    optional: boolean;
    complete: boolean;
  }>;
};
