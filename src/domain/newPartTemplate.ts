import type { NewDescriptionType } from './newDescriptionType';

export interface NewPartTemplate {
  /** uuid */
  partTemplateId: string;
  /** uuid */
  assignmentTemplateId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  created: Date;
  modified: Date | null;
}

export interface RawNewPartTemplate {
  /** uuid */
  partTemplateId: string;
  /** uuid */
  assignmentTemplateId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
  optional: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
}
