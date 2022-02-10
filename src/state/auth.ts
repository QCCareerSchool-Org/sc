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
    case 'STUDENT_LOG_IN':
      return { ...state, studentId: action.payload };
    case 'TUTOR_LOG_IN':
      return { ...state, tutorId: action.payload };
    case 'ADMINISTRATOR_LOG_IN':
      return { ...state, administratorId: action.payload };
    default:
      throw Error('invalid action in authReducer');
  }
};
