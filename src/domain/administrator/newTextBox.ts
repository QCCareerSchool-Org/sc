export type NewTextBox = {
  /** uuid */
  textBoxId: string;
  /** uuid */
  partId: string;
  description: string | null;
  lines: number | null;
  points: number;
  mark: number | null;
  markOverride: number | null;
  notes: string | null;
  optional: boolean;
  order: number;
  text: string;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewTextBox = {
  /** uuid */
  textBoxId: string;
  /** uuid */
  partId: string;
  description: string | null;
  lines: number | null;
  points: number;
  mark: number | null;
  markOverride: number | null;
  notes: string | null;
  optional: boolean;
  order: number;
  text: string;
  complete: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
