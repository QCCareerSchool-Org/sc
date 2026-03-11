export interface Unit {
  /** uuid */
  unitId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
  created: Date;
  modified: Date | null;
}

export interface RawUnit {
  /** uuid */
  unitId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
}
