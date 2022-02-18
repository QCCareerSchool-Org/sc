export type AuthState = {
  studentId?: number;
  tutorId?: number;
  administratorId?: number;
};

export type AuthAction =
  | { type: 'STUDENT_LOG_IN'; payload: number }
  | { type: 'TUTOR_LOG_IN'; payload: number }
  | { type: 'ADMINISTRATOR_LOG_IN'; payload: number };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'STUDENT_LOG_IN': {
      const newState = { ...state, studentId: action.payload };
      window.localStorage?.setItem('authState', JSON.stringify(newState));
      return newState;
    }
    case 'TUTOR_LOG_IN': {
      const newState = { ...state, tutorId: action.payload };
      window.localStorage?.setItem('authState', JSON.stringify(newState));
      return newState;
    }
    case 'ADMINISTRATOR_LOG_IN': {
      const newState = { ...state, administratorId: action.payload };
      window.localStorage?.setItem('authState', JSON.stringify(newState));
      return newState;
    }
    default:
      throw Error('invalid action in authReducer');
  }
};

export const authInitialState: AuthState = {};

export const authInitializer = (): AuthState => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const authState: AuthState = {};
    const storedAuthState = window.localStorage.getItem('authState');
    if (storedAuthState) {
      try {
        const parsedAuthState = JSON.parse(storedAuthState);
        if (typeof parsedAuthState.administratorId === 'number') {
          authState.administratorId = parsedAuthState.administratorId;
        }
        if (typeof parsedAuthState.tutorId === 'number') {
          authState.tutorId = parsedAuthState.tutorId;
        }
        if (typeof parsedAuthState.studentId === 'number') {
          authState.studentId = parsedAuthState.studentId;
        }
      } catch (err) {
        window.localStorage.removeItem('authState'); // it was invalid
      }
    }
    return authState;
  }
  return { };
};
