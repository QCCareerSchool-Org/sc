export type NewUploadSlot = {
  /** uuid */
  uploadSlotId: string;
  /** uuid */
  partId: string;
  label: string;
  allowedTypes: string[];
  points: number;
  mark: number | null;
  notes: string | null;
  optional: boolean;
  order: number;
  filename: string | null;
  filesize: number | null;
  mimeTypeId: string | null;
  complete: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewUploadSlot = {
  /** uuid */
  uploadSlotId: string;
  /** uuid */
  partId: string;
  label: string;
  allowedTypes: string[];
  points: number;
  mark: number | null;
  notes: string | null;
  optional: boolean;
  order: number;
  filename: string | null;
  filesize: number | null;
  mimeTypeId: string | null;
  complete: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
