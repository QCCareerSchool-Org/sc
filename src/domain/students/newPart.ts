export type NewPart = {
  /** hex string */
  partId: string;
  /** hex string */
  assignmentId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
};
