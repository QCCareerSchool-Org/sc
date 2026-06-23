export type StudentType = 'general' | 'design' | 'event' | 'writing' | 'makeup' | 'pet' | 'wellness';

export interface AuthenticationPayload {
  studentCenter: {
    id: number;
    studentType: StudentType;
    type: 'admin' | 'tutor' | 'student' | 'auditor';
  };
  crm?: {
    id: number;
    type: 'admin' | 'student';
  };
  exp: number;
  xsrf: string;
}
