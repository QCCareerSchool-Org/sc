export interface State {
  emailAddress?: string;
  error: boolean;
  errorCode?: number;
  form: {
    data: {
      newEmailAddress: string;
      password: string;
    };
    processingState: 'idle' | 'submitting' | 'success' | 'error';
    errorMessage?: string;
  };
}

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: string }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'NEW_EMAIL_ADDRESS_CHANGED'; payload: string }
  | { type: 'PASSWORD_CHANGED'; payload: string }
  | { type: 'UPDATE_STARTED' }
  | { type: 'UPDATE_SUCCEEDED'; payload: string }
  | { type: 'UPDATE_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, emailAddress: action.payload, error: false };
    case 'LOAD_DATA_FAILED':
      return { ...state, emailAddress: undefined, error: true, errorCode: action.payload };
    case 'NEW_EMAIL_ADDRESS_CHANGED': {
      const maxLength = 191;
      if (action.payload.length >= maxLength) {
        return state;
      }
      return { ...state, form: { ...state.form, data: { ...state.form.data, newEmailAddress: action.payload } } };
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
      return { ...state, emailAddress: action.payload, form: { ...state.form, processingState: 'success' } };
    case 'UPDATE_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
  }
};

export const initialState: State = {
  error: false,
  form: {
    data: {
      newEmailAddress: '',
      password: '',
    },
    processingState: 'idle',
  },
};
