import type { NewDescriptionType } from '../newDescriptionType';

export interface NewPart {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  markingComments: string | null;
  complete: boolean;
  points: number;
  mark: number | null;
  created: Date;
  modified: Date | null;
}

export interface RawNewPart {
  /** uuid */
  partId: string;
  /** uuid */
  assignmentId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  markingComments: string | null;
  optional: boolean;
  complete: boolean;
  points: number;
  mark: number | null;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
}
