export type State = {
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
};

export type Action =
| { type: 'LOAD_DATA_SUCCEEDED'; payload: string }
| { type: 'LOAD_DATA_FAILED'; payload?: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, emailAddress: action.payload, error: false };
    case 'LOAD_DATA_FAILED':
      return { ...state, emailAddress: undefined, error: true, errorCode: action.payload };
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
