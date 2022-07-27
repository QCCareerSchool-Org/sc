export type CRMCurrency = {
  currencyId: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  created: Date;
  modified: Date | null;
};

export type RawCRMCurrency = {
  currencyId: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
