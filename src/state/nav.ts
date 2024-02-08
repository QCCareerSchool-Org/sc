type NavType = 'administrator' | 'tutor' | 'student' | 'auditor';

export type NavState = {
  type?: NavType;
  index?: number;
};

export type NavAction =
  | { type: 'SET_PAGE'; payload: { type: NavType; index: number } };

export const navReducer = (state: NavState, action: NavAction): NavState => {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, type: action.payload.type, index: action.payload.index };
    default:
      throw Error('invalid action in navReducer');
  }
};

export const navInitialState: NavState = {};
