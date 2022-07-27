export type TransactionType = 'charge' | 'refund' | 'chargeback' | 'nsfFee' | 'void';

export type CRMTransaction = {
  transactionId: number;
  enrollmentId: number;
  paymentMethodId: number | null;
  userId: number | null;
  parentId: number | null;
  transactionDateTime: Date;
  amount: number;
  attemptedAmount: number;
  usdAmount: number | null;
  refund: number;
  chargeback: number;
  orderId: string | null;
  responseCode: number | null;
  authCode: string | null;
  referenceNumber: string | null;
  settlementId: string | null;
  transactionNumber: string | null;
  response: string | null;
  description: string | null;
  posted: boolean | null;
  postedDate: Date | null;
  notified: boolean | null;
  extraCharge: boolean;
  auto: boolean;
  reattempt: boolean;
  transactionType: TransactionType;
  voided: boolean;
  notes: string | null;
  severity: number | null;
  created: Date;
  modified: Date | null;
};

export type RawCRMTransaction = {
  transactionId: number;
  enrollmentId: number;
  paymentMethodId: number | null;
  userId: number | null;
  parentId: number | null;
  /** string date */
  transactionDateTime: string;
  amount: number;
  attemptedAmount: number;
  usdAmount: number | null;
  refund: number;
  chargeback: number;
  orderId: string | null;
  responseCode: number | null;
  authCode: string | null;
  referenceNumber: string | null;
  settlementId: string | null;
  transactionNumber: string | null;
  response: string | null;
  description: string | null;
  posted: boolean | null;
  /** string date */
  postedDate: string | null;
  notified: boolean | null;
  extraCharge: boolean;
  auto: boolean;
  reattempt: boolean;
  transactionType: TransactionType;
  voided: boolean;
  notes: string | null;
  severity: number | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
