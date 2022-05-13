export type NewUnitTemplatePrice = {
  unitTemplatePriceId: string;
  unitTemplateId: string;
  countryId: number | null;
  currencyId: number;
  price: number;
  created: Date;
  modified: Date | null;
};

export type RawNewUnitTemplatePrice = {
  unitTemplatePriceId: string;
  unitTemplateId: string;
  countryId: number | null;
  currencyId: number;
  price: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
