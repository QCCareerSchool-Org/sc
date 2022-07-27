export type CRMStudent = {
  studentId: number;
  currencyId: number;
  userId: number | null;
  languageId: number;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  provinceId: number | null;
  postalCode: string | null;
  countryId: number;
  telephoneCountryCode: number;
  telephoneNumber: string;
  emailAddress: string;
  paymentStart: Date | null;
  paymentDay: number | null;
  sms: boolean;
  created: Date;
  modified: Date | null;
};

export type RawCRMStudent = {
  studentId: number;
  currencyId: number;
  userId: number | null;
  languageId: number;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  provinceId: number | null;
  postalCode: string | null;
  countryId: number;
  telephoneCountryCode: number;
  telephoneNumber: string;
  emailAddress: string;
  paymentStart: Date | null;
  paymentDay: number | null;
  sms: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
