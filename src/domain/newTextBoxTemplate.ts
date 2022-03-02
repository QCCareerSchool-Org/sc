export type NewTextBoxTemplate = {
  /** uuid */
  textBoxId: string;
  /** uuid */
  partId: string;
  description: string | null;
  lines: number | null;
  points: number;
  optional: boolean;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewTextBoxTemplate = {
  /** uuid */
  textBoxId: string;
  /** uuid */
  partId: string;
  description: string | null;
  lines: number | null;
  points: number;
  optional: boolean;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
