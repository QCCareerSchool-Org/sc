import type { NewMediumType } from './newAssignmentMedium';

export interface NewPartMedium {
  /** uuid */
  partMediumId: string;
  /** uuid */
  partTemplateId: string | null;
  mimeTypeId: string;
  type: NewMediumType;
  filename: string;
  filesize: number;
  caption: string;
  externalData: string | null;
  order: number;
  created: Date;
  modified: Date | null;
}

export interface RawNewPartMedium {
  /** uuid */
  partMediumId: string;
  /** uuid */
  partTemplateId: string | null;
  mimeTypeId: string;
  type: NewMediumType;
  filename: string;
  filesize: number;
  caption: string;
  externalData: string | null;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
}
