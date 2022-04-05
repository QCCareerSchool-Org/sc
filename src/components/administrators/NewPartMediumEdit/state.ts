import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewPartMediumWithPart } from '@/services/administrators/newPartMediumService';

export type State = {
  newPartMedium?: NewPartMediumWithPart;
  form: {
    data: {
      dataSource: 'file upload' | 'url';
      caption: string;
      order: string;
      file: File | null;
      externalData: string;
    };
    validationMessages: {
      dataSource?: string;
      caption?: string;
      order?: string;
      file?: string;
      externalData?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_PART_MEDIUM_SUCCEEDED'; payload: NewPartMediumWithPart }
  | { type: 'LOAD_PART_MEDIUM_FAILED'; payload?: number }
  | { type: 'CAPTION_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'SAVE_PART_MEDIUM_STARTED' }
  | { type: 'SAVE_PART_MEDIUM_SUCCEEDED'; payload: NewPartMedium }
  | { type: 'SAVE_PART_MEDIUM_FAILED'; payload?: string }
  | { type: 'DELETE_PART_MEDIUM_STARTED' }
  | { type: 'DELETE_PART_MEDIUM_SUCCEEDED' }
  | { type: 'DELETE_PART_MEDIUM_FAILED'; payload?: string };

export const initialState: State = {
  error: false,
  form: {
    data: {
      dataSource: 'file upload',
      caption: '',
      order: '0',
      file: null,
      externalData: '',
    },
    validationMessages: {},
    processingState: 'idle',
  },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_PART_MEDIUM_SUCCEEDED':
      return {
        ...state,
        newPartMedium: action.payload,
        form: {
          data: {
            dataSource: action.payload.externalData !== null ? 'file upload' : 'url',
            caption: action.payload.caption,
            order: action.payload.order.toString(),
            file: null,
            externalData: action.payload.externalData ?? '',
          },
          validationMessages: {},
          processingState: 'idle',
        },
      };
    case 'LOAD_PART_MEDIUM_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'CAPTION_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const maxLength = 191;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, caption: action.payload },
          validationMessages: { ...state.form.validationMessages, caption: validationMessage },
        },
      };
    }
    case 'ORDER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const order = parseInt(action.payload, 10);
        if (isNaN(order)) {
          validationMessage = 'Invalid number';
        } else if (order < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (order > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, order: action.payload },
          validationMessages: { ...state.form.validationMessages, order: validationMessage },
        },
      };
    }
    case 'SAVE_PART_MEDIUM_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_PART_MEDIUM_SUCCEEDED':
      if (!state.newPartMedium) {
        throw Error('newPartMedium is undefined');
      }
      return {
        ...state,
        newPartMedium: {
          ...state.newPartMedium,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            dataSource: action.payload.externalData !== null ? 'file upload' : 'url',
            caption: action.payload.caption,
            order: action.payload.order.toString(),
            file: null,
            externalData: action.payload.externalData ?? '',
          },
          validationMessages: {},
          processingState: 'idle',
        },
      };
    case 'SAVE_PART_MEDIUM_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_PART_MEDIUM_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_PART_MEDIUM_SUCCEEDED':
      return {
        ...state,
        newPartMedium: undefined,
        form: {
          ...state.form,
          data: {
            dataSource: 'file upload',
            caption: '',
            order: '0',
            file: null,
            externalData: '',
          },
          validationMessages: {},
          processingState: 'idle',
        },
      };
    case 'DELETE_PART_MEDIUM_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'delete error', errorMessage: action.payload },
      };
  }
};
