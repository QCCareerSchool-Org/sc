export type NewSubmissionTemplatePrice = {
  unitTemplatePriceId: string;
  unitTemplateId: string;
  countryId: number | null;
  currencyId: number;
  price: number;
  created: Date;
  modified: Date | null;
};

export type RawNewSubmissionTemplatePrice = {
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
