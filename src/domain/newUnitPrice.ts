export type NewUnitPrice = {
  unitPriceId: string;
  unitId: string;
  countryId: number | null;
  currencyId: number;
  price: number;
  selected: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewUnitPrice = {
  unitPriceId: string;
  unitId: string;
  countryId: number | null;
  currencyId: number;
  price: number;
  selected: boolean;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
