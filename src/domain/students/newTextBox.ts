export type NewTextBox = {
  /** hex string */
  textBoxId: string;
  /** hex string */
  partId: string;
  description: string | null;
  lines: number | null;
  optional: boolean;
  order: number;
  complete: boolean;
};
