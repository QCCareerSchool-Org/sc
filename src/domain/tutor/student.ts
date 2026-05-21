export interface Student {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  note: string | null;
  entityVersion: number;
  modified: Date;
}

export interface RawStudent {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  passwordChanged: boolean;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  note: string | null;
  entityVersion: number;
  /** string date */
  modified: string;
}
