export type NewMediumType = 'image' | 'video' | 'audio';

export type NewAssignmentMedium = {
  /** uuid */
  assignmentMediumId: string;
  /** uuid */
  assignmentTemplateId: string | null;
  mimeTypeId: string;
  type: NewMediumType;
  caption: string | null;
  externalData: string | null;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewAssignmentMedium = {
  /** uuid */
  assignmentMediumId: string;
  /** uuid */
  assignmentTemplateId: string | null;
  mimeTypeId: string;
  caption: string | null;
  externalData: string | null;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
