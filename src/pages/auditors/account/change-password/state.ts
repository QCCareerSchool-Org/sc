export type State = {
  form: {
    data: {
      newPassword: string;
      newPasswordRepeat: string;
      password: string;
    };
    processingState: 'idle' | 'submitting' | 'success' | 'error';
    errorMessage?: string;
  };
};

export type Action =
  | { type: 'NEW_PASSWORD_CHANGED'; payload: string }
  | { type: 'NEW_PASSWORD_REPEAT_CHANGED'; payload: string }
  | { type: 'PASSWORD_CHANGED'; payload: string }
  | { type: 'UPDATE_STARTED' }
  | { type: 'UPDATE_SUCCEEDED' }
  | { type: 'UPDATE_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'NEW_PASSWORD_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, newPassword: action.payload } } };
    }
    case 'NEW_PASSWORD_REPEAT_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, newPasswordRepeat: action.payload } } };
    }
    case 'PASSWORD_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, password: action.payload } } };
    }
    case 'UPDATE_STARTED':
      return { ...state, form: { ...state.form, processingState: 'submitting', errorMessage: undefined } };
    case 'UPDATE_SUCCEEDED':
      return { ...state, form: { ...state.form, processingState: 'success' } };
    case 'UPDATE_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
  }
};

export const initialState: State = {
  form: {
    data: {
      newPassword: '',
      newPasswordRepeat: '',
      password: '',
    },
    processingState: 'idle',
  },
};
