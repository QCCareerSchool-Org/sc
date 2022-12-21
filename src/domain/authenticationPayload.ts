export type StudentType = 'general' | 'design' | 'event' | 'writing';

export type AuthenticationPayload = {
  studentCenter: {
    id: number;
    studentType: StudentType;
    type: 'admin' | 'tutor' | 'student';
  };
  crm?: {
    id: number;
    type: 'admin' | 'student';
  };
  exp: number;
  xsrf: string;
};
