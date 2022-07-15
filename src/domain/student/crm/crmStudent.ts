export type CRMStudent = {
  studentId: number;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string | null;
  postalCode: string | null;
  country: string;
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
  province: string | null;
  postalCode: string | null;
  country: string;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
