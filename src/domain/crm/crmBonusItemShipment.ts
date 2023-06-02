export type CRMBonusItemShipment = {
  /** UUID string */
  bonusItemShipmentId: string;
  enrollmentId: number;
  /** UUID string */
  bonusItemId: string;
  threshold: number | null;
  qualified: Date | null;
  prepared: Date | null;
  shipped: Date | null;
  created: Date;
};

export type RawCRMBonusItemShipment = {
  /** UUID string */
  bonusItemShipmentId: string;
  enrollmentId: number;
  /** UUID string */
  bonusItemId: string;
  threshold: number | null;
  /** string date */
  qualified: string | null;
  /** string date */
  prepared: string | null;
  /** string date */
  shipped: string | null;
  /** string date */
  created: string;
};
