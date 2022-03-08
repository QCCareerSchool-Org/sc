export type NewUnitTemplate = {
  /** uuid */
  unitTemplateId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewUnitTemplate = {
  /** uuid */
  unitTemplateId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  optional: boolean;
  order: number;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
