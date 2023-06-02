export type CRMBonusItem = {
  /** UUID string */
  bonusItemId: string;
  name: string;
  description: string;
  enabled: boolean;
  default: boolean;
  shipImmediately: boolean;
  threshold: number | null;
  created: Date;
  modified: Date | null;
};

export type RawCRMBonusItem = {
  /** UUID string */
  bonusItemId: string;
  name: string;
  description: string;
  enabled: boolean;
  default: boolean;
  shipImmediately: boolean;
  threshold: number | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
