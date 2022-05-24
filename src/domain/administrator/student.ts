export type AdministratorStudent = {
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
  creationDate: Date;
  arrears: boolean;
  forumUsername: string | null;
  apiUsername: number | null;
  questionnaire: boolean;
  videoViewed: boolean;
  ajaxUploads: boolean;
  upgradeNotification: boolean;
  entityVersion: number;
  timestamp: Date;
};

export type RawAdministratorStudent = {
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
  /** string date */
  creationDate: string;
  arrears: boolean;
  forumUsername: string | null;
  apiUsername: number | null;
  questionnaire: boolean;
  videoViewed: boolean;
  ajaxUploads: boolean;
  upgradeNotification: boolean;
  entityVersion: number;
  /** string date */
  timestamp: string;
};
