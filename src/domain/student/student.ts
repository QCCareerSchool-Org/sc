export type Student = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  passwordChanged: boolean;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  numLogins: number;
  lastLogin: Date | null;
  expiry: Date | null;
  emailAddress: string | null;
  arrears: boolean;
  forumUsername: string | null;
  forumPasswordNew: string | null;
  apiUsername: number | null;
  apiPasswordNew: string | null;
  questionnaire: boolean;
  videoViewed: boolean;
  ajaxUploads: boolean;
  upgradeNotification: boolean;
  entityVersion: number;
  created: Date;
  modified: Date;
  hasCASocialInsuranceNumber: boolean;
};

export type RawStudent = {
  studentId: number;
  countryId: number;
  provinceId: number | null;
  studentTypeId: string;
  passwordChanged: boolean;
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  numLogins: number;
  /** string date */
  lastLogin: string | null;
  /** string date */
  expiry: string | null;
  emailAddress: string | null;
  arrears: boolean;
  forumUsername: string | null;
  forumPasswordNew: string | null;
  apiUsername: number | null;
  apiPasswordNew: string | null;
  questionnaire: boolean;
  videoViewed: boolean;
  ajaxUploads: boolean;
  upgradeNotification: boolean;
  entityVersion: number;
  /** string date */
  created: string;
  /** string date */
  modified: string;
  hasCASocialInsuranceNumber: boolean;
};
