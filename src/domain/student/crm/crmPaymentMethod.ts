export type PaysafeCompany = 'CA' | 'US' | 'GB';

export type CRMPaymentMethod = {
  paymentMethodId: number;
  enrollmentId: number | null;
  paymentTypeId: number;
  primary: boolean;
  thirdParty: boolean;
  paysafeProfileId: string | null;
  paysafeCardId: string | null;
  paysafePaymentToken: string | null;
  paysafeCompany: PaysafeCompany | null;
  pan: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  deleted: boolean;
  notified: boolean;
  disabled: boolean;
  transactionCount: number;
  created: Date;
  modified: Date | null;
};

export type RawCRMPaymentMethod = {
  paymentMethodId: number;
  enrollmentId: number | null;
  paymentTypeId: number;
  primary: boolean;
  thirdParty: boolean;
  paysafeProfileId: string | null;
  paysafeCardId: string | null;
  paysafePaymentToken: string | null;
  paysafeCompany: PaysafeCompany | null;
  pan: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  deleted: boolean;
  notified: boolean;
  disabled: boolean;
  transactionCount: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
