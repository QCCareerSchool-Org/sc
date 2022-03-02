export type NewUploadSlotTemplate = {
  /** uuid */
  uploadSlotId: string;
  /** uuid */
  partId: string;
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
  uploadSlotId: string;
  /** uuid */
  partId: string;
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
