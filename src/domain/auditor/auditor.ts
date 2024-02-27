export type Auditor = {
  auditorId: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  created: Date;
  modified: Date | null;
};

export type RawAuditor = {
  auditorId: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
