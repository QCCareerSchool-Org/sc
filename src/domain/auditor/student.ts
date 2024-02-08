export type Student = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  numLogins: number;
  lastLogin: Date | null;
  expiry: Date | null;
  emailAddress: string | null;
  arrears: boolean;
  entityVersion: number;
  created: Date;
  modified: Date;
};

export type RawStudent = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  numLogins: number;
  /** string date */
  lastLogin: string | null;
  /** string date */
  expiry: string | null;
  emailAddress: string | null;
  arrears: boolean;
  entityVersion: number;
  /** string date */
  created: string;
  /** string date */
  modified: string;
};
