export type Student = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  entityVersion: number;
  modified: Date;
};

export type RawStudent = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  passwordChanged: boolean;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  entityVersion: number;
  /** string date */
  modified: string;
};
