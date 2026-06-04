import type { SchoolName } from './school';

export interface Award {
  /** uuid */
  submissionId: string;
  courseName: string;
  schoolName: string;
  unitLetter: string;
  grade: string;
  /** the student's name */
  name: string;
  created: Date;
  designation: string;
}

export interface RawAward {
  submissionId: string | number;
  courseName: string;
  schoolName: SchoolName;
  unitLetter: string;
  grade: string;
  /** student name */
  name: string;
  /** string date */
  created: string | null;
  designation: string;
}
