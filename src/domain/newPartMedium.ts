import type { NewMediumType } from './newAssignmentMedium';

export type NewPartMedium = {
  /** uuid */
  partMediumId: string;
  /** uuid */
  partTemplateId: string | null;
  mimeTypeId: string;
  type: NewMediumType;
  filename: string;
  caption: string;
  externalData: string | null;
  size: number;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewPartMedium = {
  /** uuid */
  partMediumId: string;
  /** uuid */
  partTemplateId: string | null;
  mimeTypeId: string;
  type: NewMediumType;
  filename: string;
  caption: string;
  externalData: string | null;
  size: number;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
