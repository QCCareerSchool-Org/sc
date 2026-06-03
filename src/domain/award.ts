import type { School } from './school';

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
}

export interface RawAward {
  submissionId: string | number;
  courseName: string;
  schoolName: School;
  unitLetter: string;
  grade: string;
  /** student name */
  name: string;
  /** string date */
  created: string | null;
}
