import type { NewDescriptionType } from './newDescriptionType';

export type NewPart = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewPart = {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  optional: boolean;
  complete: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
