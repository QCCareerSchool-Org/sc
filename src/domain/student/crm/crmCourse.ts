export type CRMCourse = {
  courseId: number;
  schoolId: number;
  code: string;
  name: string;
  prefix: string;
  maxAssignments: number | null;
  order: number;
  cost: number;
  // enrollmentCount is omitted
  created: Date;
  modified: Date | null;
};

export type RawCRMCourse = {
  courseId: number;
  schoolId: number;
  code: string;
  name: string;
  prefix: string;
  maxAssignments: number | null;
  order: number;
  cost: number;
  // enrollmentCount is omitted
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
