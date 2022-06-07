export type PasswordResetRequest = {
  id: number;
  code: string;
  administratorId: number | null;
  tutorId: number | null;
  studentId: number | null;
  username: string;
  used: boolean;
  requestDate: Date;
  expiryDate: Date | null;
};

export type RawPasswordResetRequest = {
  id: number;
  code: string;
  administratorId: number | null;
  tutorId: number | null;
  studentId: number | null;
  username: string;
  used: boolean;
  /** string date */
  requestDate: string;
  /** string date */
  expiryDate: string | null;
};
