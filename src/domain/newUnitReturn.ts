export type NewUnitReturn = {
  /** uuid */
  unitReturnId: string;
  /** uuid */
  unitId: string;
  returned: Date;
  completed: Date | null;
};

// what we get from the back end
export type RawNewUnitReturn = {
  /** uuid */
  unitReturnId: string;
  /** uuid */
  unitId: string;
  /** string date */
  returned: string;
  /** string date */
  completed: string | null;
};
