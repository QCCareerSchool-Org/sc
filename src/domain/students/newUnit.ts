export type NewUnit = {
  /** hex string */
  unitId: string;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  complete: boolean;
  created: Date;
};
