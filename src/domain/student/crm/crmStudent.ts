export type CRMStudent = {
  studentId: number;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  provinceId: number | null;
  postalCode: string | null;
  countryId: number;
  created: Date;
  modified: Date | null;
};

export type RawCRMStudent = {
  studentId: number;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  provinceId: number | null;
  postalCode: string | null;
  countryId: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
