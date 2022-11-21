import type { NewDescriptionType } from './newDescriptionType';

export type NewAssignment = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  optional: boolean;
  complete: boolean;
  points: number;
  mark: number | null;
  created: Date;
  modified: Date | null;
};

// what we get from the back end
export type RawNewAssignment = {
  /** uuid */
  assignmentId: string;
  /** uuid */
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  optional: boolean;
  complete: boolean;
  points: number;
  mark: number | null;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
