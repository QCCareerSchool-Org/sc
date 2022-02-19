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
  textBoxes: Array<{
    /** hex string */
    textBoxId: string;
    /** hex string */
    partId: string;
    description: string | null;
    lines: number | null;
    optional: boolean;
    order: number;
    complete: boolean;
  }>;
  uploadSlots: Array<{
    /** hex string */
    uploadSlotId: string;
    /** hex string */
    partId: string;
    label: string;
    optional: boolean;
    order: number;
    complete: boolean;
  }>;
};
