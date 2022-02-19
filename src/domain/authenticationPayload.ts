export type AuthenticationPayload = {
  crmId: number | null;
  exp: number;
  id: number;
  studentType: 'general' | 'design' | 'event' | 'writing';
  type: 'administrator' | 'tutor' | 'student';
  xsrf: string;
};
