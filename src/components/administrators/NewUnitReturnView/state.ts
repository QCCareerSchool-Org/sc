import type { NewUnitReturn } from '@/domain/newUnitReturn';
import type { NewUnitReturnWithUnit, NewUnitReturnWithUnitWithTutorAndEnrollment } from '@/services/administrators/newUnitReturnService';

export type State = {
  newUnitReturn?: NewUnitReturnWithUnitWithTutorAndEnrollment;
  form: {
    adminComment: string;
    validationMessage?: string;
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_UNIT_RETURN_SUCEEDED'; payload: NewUnitReturnWithUnitWithTutorAndEnrollment }
  | { type: 'LOAD_UNIT_RETURN_FAILED'; payload?: number }
  | { type: 'ADMIN_COMMENT_CHANGED'; payload: string }
  | { type: 'SAVE_ADMIN_COMMENT_STARTED' }
  | { type: 'SAVE_ADMIN_COMMENT_SUCEEDED'; payload: NewUnitReturnWithUnit }
  | { type: 'SAVE_ADMIN_COMMENT_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    adminComment: '',
    processingState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UNIT_RETURN_SUCEEDED':
      return {
        ...state,
        newUnitReturn: action.payload,
        form: {
          adminComment: action.payload.newUnit.adminComment ?? '',
          processingState: 'idle',
        },
      };
    case 'LOAD_UNIT_RETURN_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'ADMIN_COMMENT_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 65_535;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return { ...state, form: { ...state.form, adminComment: action.payload, validationMessage } };
    }
    case 'SAVE_ADMIN_COMMENT_STARTED':
      return { ...state, form: { ...state.form, processingState: 'saving', errorMessage: undefined } };
    case 'SAVE_ADMIN_COMMENT_SUCEEDED':
      if (typeof state.newUnitReturn === 'undefined') {
        throw Error('newUnitReturn is undefined');
      }
      return {
        ...state,
        newUnitReturn: {
          ...state.newUnitReturn,
          ...action.payload,
          newUnit: {
            ...state.newUnitReturn.newUnit,
            ...action.payload.newUnit,
          },
        },
        form: { ...state.form, processingState: 'idle' },
      };
    case 'SAVE_ADMIN_COMMENT_FAILED':
      return { ...state, form: { ...state.form, processingState: 'save error', errorMessage: action.payload } };
  }
};
