export interface CRMBonusItem {
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
}

export interface RawCRMBonusItem {
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
}
