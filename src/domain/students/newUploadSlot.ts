export type NewUploadSlot = {
  /** hex string */
  uploadSlotId: string;
  /** hex string */
  partId: string;
  label: string;
  optional: boolean;
  order: number;
  filename: string | null;
  size: number | null;
  mimeType: string | null;
  complete: boolean;
};
