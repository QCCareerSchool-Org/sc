export type NewUploadSlot = {
  /** hex string */
  uploadSlotId: string;
  /** hex string */
  partId: string;
  label: string;
  optional: boolean;
  order: number;
  complete: boolean;
};
