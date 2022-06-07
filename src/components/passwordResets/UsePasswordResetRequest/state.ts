import type { PasswordResetRequest } from '@/domain/passwordResetRequest';

export type State = {
  passwordResetRequest?: PasswordResetRequest;
  complete: boolean;
  form: {
    data: {
      password: string;
      passwordRepeat: string;
    };
    validationMessages: {
      form?: string;
      password?: string;
      passwordRepeat?: string;
    };
    processingState: 'idle' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_STARTED' }
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: PasswordResetRequest }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'PASSWORD_CHANGED'; payload: string }
  | { type: 'PASSWORD_REPEAT_CHANGED'; payload: string }
  | { type: 'RESET_STARTED' }
  | { type: 'RESET_SUCCEEDED' }
  | { type: 'RESET_FAILED'; payload?: string };

export const initialState: State = {
  complete: false,
  form: {
    data: {
      password: '',
      passwordRepeat: '',
    },
    validationMessages: {},
    processingState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_STARTED':
      return initialState;
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, passwordResetRequest: action.payload };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'PASSWORD_CHANGED': {
      let validationMessage: string | undefined;
      const maxLength = 255;
      if ([ ...action.payload ].length > maxLength) {
        validationMessage = 'Exceeds maximum length';
      } else if (action.payload === 'T4^pB4%6SYNNI+m') {
        validationMessage = 'Don\'t use the actual example password';
      }
      let formValidationMessage: string | undefined;
      if (action.payload.length && state.form.data.passwordRepeat.length && action.payload !== state.form.data.passwordRepeat) {
        formValidationMessage = 'Passwords do not match';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, password: action.payload },
          validationMessages: { ...state.form.validationMessages, password: validationMessage, form: formValidationMessage },
        },
      };
    }
    case 'PASSWORD_REPEAT_CHANGED': {
      let validationMessage: string | undefined;
      const maxLength = 255;
      if ([ ...action.payload ].length > maxLength) {
        validationMessage = 'Exceeds maximum length';
      }
      let formValidationMessage: string | undefined;
      if (action.payload.length && state.form.data.password.length && action.payload !== state.form.data.password) {
        formValidationMessage = 'Passwords do not match';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, passwordRepeat: action.payload },
          validationMessages: { ...state.form.validationMessages, passwordRepeat: validationMessage, form: formValidationMessage },
        },
      };
    }
    case 'RESET_STARTED':
      return { ...state, form: { ...state.form, processingState: 'processing', errorMessage: undefined } };
    case 'RESET_SUCCEEDED':
      return { ...state, complete: true, form: { ...state.form, processingState: 'success' } };
    case 'RESET_FAILED':
      return { ...state, form: { ...state.form, processingState: 'error', errorMessage: action.payload } };
  }
};
