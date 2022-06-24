export type NewMaterialUnit = {
  /** uuid */
  materialUnitId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
  created: Date;
  modified: Date | null;
};

export type RawNewMaterialUnit = {
  /** uuid */
  materialUnitId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
