export type NewUploadSlot = {
  /** uuid */
  uploadSlotId: string;
  /** uuid */
  partId: string;
  label: string;
  allowedTypes: string[];
  optional: boolean;
  order: number;
  filename: string | null;
  size: number | null;
  mimeType: string | null;
  complete: boolean;
};
