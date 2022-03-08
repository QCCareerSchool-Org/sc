export type NewUploadSlotTemplate = {
  /** uuid */
  uploadSlotTemplateId: string;
  /** uuid */
  partTemplateId: string;
  label: string;
  allowedTypes: string[];
  points: number;
  optional: boolean;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewUploadSlotTemplate = {
  /** uuid */
  uploadSlotTemplateId: string;
  /** uuid */
  partTemplateId: string;
  label: string;
  allowedTypes: string[];
  points: number;
  optional: boolean;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
