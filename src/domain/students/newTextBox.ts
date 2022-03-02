export type NewTextBox = {
  /** uuid */
  textBoxId: string;
  /** uuid */
  partId: string;
  description: string | null;
  lines: number | null;
  points: number;
  mark: number | null;
  optional: boolean;
  order: number;
  text: string;
  complete: boolean;
};
