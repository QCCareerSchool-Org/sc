export type NewPartTemplate = {
  /** uuid */
  partTemplateId: string;
  /** uuid */
  assignmentTemplateId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewPartTemplate = {
  /** uuid */
  partTemplateId: string;
  /** uuid */
  assignmentTemplateId: string;
  partNumber: number;
  title: string | null;
  description: string | null;
  optional: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
