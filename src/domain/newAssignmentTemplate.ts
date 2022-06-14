import type { NewDescriptionType } from './newDescriptionType';

export type NewAssignmentTemplate = {
  /** uuid */
  assignmentTemplateId: string;
  /** uuid */
  unitTemplateId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  optional: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewAssignmentTemplate = {
  /** uuid */
  assignmentTemplateId: string;
  /** uuid */
  unitTemplateId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  optional: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
