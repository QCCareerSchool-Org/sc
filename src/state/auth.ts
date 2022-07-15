export type AuthState = {
  studentId?: number;
  tutorId?: number;
  administratorId?: number;
  crmId?: number;
  xsrfToken?: string;
};

export type AuthAction =
  | { type: 'STUDENT_LOG_IN'; payload: { accountId: number; xsrfToken: string; crmId?: number } }
  | { type: 'TUTOR_LOG_IN'; payload: { accountId: number; xsrfToken: string } }
  | { type: 'ADMINISTRATOR_LOG_IN'; payload: { accountId: number; xsrfToken: string } };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'STUDENT_LOG_IN': {
      const newState: AuthState = { ...state, studentId: action.payload.accountId, xsrfToken: action.payload.xsrfToken, crmId: action.payload.crmId };
      storeState(newState);
      return newState;
    }
    case 'TUTOR_LOG_IN': {
      const newState: AuthState = { ...state, tutorId: action.payload.accountId, xsrfToken: action.payload.xsrfToken };
      storeState(newState);
      return newState;
    }
    case 'ADMINISTRATOR_LOG_IN': {
      const newState: AuthState = { ...state, administratorId: action.payload.accountId, xsrfToken: action.payload.xsrfToken };
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
          if (typeof parsedAuthState.xsrfToken === 'string') {
            authState.xsrfToken = parsedAuthState.xsrfToken;
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

const isRecord = (u: unknown): u is Record<string | number, unknown> => {
  return typeof u === 'object' && u !== null;
};
