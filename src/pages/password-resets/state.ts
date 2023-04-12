import type { CreatePasswordResetResult } from '@/services/passwordResetRequestService';

export type State = {
  form: {
    data: {
      username: string;
    };
    validationMessages: {
      username?: string;
    };
    processingState: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
  result?: {
    maskedEmailAddress: string;
    expiryDate: Date;
  };
};

export type Action =
  | { type: 'USERNAME_CHANGED'; payload: string }
  | { type: 'REQUEST_STARTED' }
  | { type: 'REQUEST_SUCCEEDED'; payload: CreatePasswordResetResult }
  | { type: 'REQUEST_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: { username: '' },
    validationMessages: {},
    processingState: 'idle',
  },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'USERNAME_CHANGED': {
      const maxLength = 255;
      let validationMessage: string | undefined;
      if ([ ...action.payload ].length > maxLength) {
        validationMessage = 'Exceeds maximum length';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            username: action.payload,
          },
          validationMessages: {
            ...state.form.validationMessages,
            username: validationMessage,
          },
        },
      };
    }
    case 'REQUEST_STARTED':
      return { ...state, form: { ...state.form, processingState: 'processing', errorMessage: undefined } };
    case 'REQUEST_SUCCEEDED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'success',
        },
        result: action.payload,
      };
    case 'REQUEST_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
  }
};
