import type { StudentType } from '@/domain/authenticationPayload';

export type AuthState = {
  studentId?: number;
  tutorId?: number;
  auditorId?: number;
  administratorId?: number;
  crmId?: number;
  studentType?: StudentType;
  xsrfToken?: string;
};

export type AuthAction =
  | { type: 'INITIALIZE'; payload: AuthState }
  | { type: 'STUDENT_LOG_IN'; payload: { accountId: number; xsrfToken: string; crmId?: number; studentType: StudentType } }
  | { type: 'TUTOR_LOG_IN'; payload: { accountId: number; xsrfToken: string } }
  | { type: 'ADMINISTRATOR_LOG_IN'; payload: { accountId: number; xsrfToken: string } }
  | { type: 'AUDITOR_LOG_IN'; payload: { accountId: number; xsrfToken: string } }
  | { type: 'ADMINISTRATOR_LOG_OUT' }
  | { type: 'AUDITOR_LOG_OUT' }
  | { type: 'TUTOR_LOG_OUT' }
  | { type: 'STUDENT_LOG_OUT' };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;
    case 'STUDENT_LOG_IN': {
      const newState: AuthState = {
        ...state,
        studentId: action.payload.accountId,
        xsrfToken: action.payload.xsrfToken,
        crmId: action.payload.crmId,
        studentType: action.payload.studentType,
      };
      storeState(newState);
      return newState;
    }
    case 'TUTOR_LOG_IN': {
      const newState: AuthState = { ...state, tutorId: action.payload.accountId, xsrfToken: action.payload.xsrfToken };
      storeState(newState);
      return newState;
    }
    case 'AUDITOR_LOG_IN': {
      const newState: AuthState = { ...state, auditorId: action.payload.accountId, xsrfToken: action.payload.xsrfToken };
      storeState(newState);
      return newState;
    }
    case 'ADMINISTRATOR_LOG_IN': {
      const newState: AuthState = { ...state, administratorId: action.payload.accountId, xsrfToken: action.payload.xsrfToken };
      storeState(newState);
      return newState;
    }
    case 'ADMINISTRATOR_LOG_OUT': {
      const newState: AuthState = { ...state, administratorId: undefined };
      storeState(newState);
      return newState;
    }
    case 'AUDITOR_LOG_OUT': {
      const newState: AuthState = { ...state, auditorId: undefined };
      storeState(newState);
      return newState;
    }
    case 'TUTOR_LOG_OUT': {
      const newState: AuthState = { ...state, tutorId: undefined };
      storeState(newState);
      return newState;
    }
    case 'STUDENT_LOG_OUT': {
      const newState: AuthState = { ...state, studentId: undefined };
      storeState(newState);
      return newState;
    }
    default:
      throw Error('invalid action in authReducer');
  }
};

const storeState = (state: AuthState): void => {
  if (typeof window !== 'undefined' && 'localStorage' in window && navigator.cookieEnabled) {
    window.localStorage?.setItem('authState', JSON.stringify(state));
  }
};

export const authInitialState: AuthState = {};

export const authInitializer = (): AuthState => {
  const authState: AuthState = {};
  if (typeof window !== 'undefined' && 'localStorage' in window && navigator.cookieEnabled) {
    const storedAuthState = window.localStorage.getItem('authState');
    if (storedAuthState) {
      try {
        const parsedAuthState = JSON.parse(storedAuthState) as unknown;
        if (isRecord(parsedAuthState)) {
          if (typeof parsedAuthState.administratorId === 'number') {
            authState.administratorId = parsedAuthState.administratorId;
          }
          if (typeof parsedAuthState.tutorId === 'number') {
            authState.tutorId = parsedAuthState.tutorId;
          }
          if (typeof parsedAuthState.studentId === 'number') {
            authState.studentId = parsedAuthState.studentId;
          }
          if (typeof parsedAuthState.auditorId === 'number') {
            authState.auditorId = parsedAuthState.auditorId;
          }
          if (typeof parsedAuthState.xsrfToken === 'string') {
            authState.xsrfToken = parsedAuthState.xsrfToken;
          }
          if (typeof parsedAuthState.crmId === 'number') {
            authState.crmId = parsedAuthState.crmId;
          }
          if (isStudentType(parsedAuthState.studentType)) {
            authState.studentType = parsedAuthState.studentType;
          }
        } else {
          window.localStorage.removeItem('authState'); // it was invalid
        }
      } catch (err) { // json parse error
        window.localStorage.removeItem('authState'); // it was invalid
      }
    }
  }
  return authState;
};

const isRecord = (u: unknown): u is Record<string | number | symbol, unknown> => {
  return typeof u === 'object' && u !== null;
};

const isStudentType = (u: unknown): u is StudentType => {
  return typeof u === 'string' && [ 'general', 'design', 'event', 'writing' ].includes(u);
};
