export type AuthenticationPayload = {
  studentCenter: {
    id: number;
    studentType: 'general' | 'design' | 'event' | 'writing';
    type: 'admin' | 'tutor' | 'student';
  };
  crm?: {
    id: number;
    type: 'admin' | 'student';
  };
  exp: number;
  xsrf: string;
};
