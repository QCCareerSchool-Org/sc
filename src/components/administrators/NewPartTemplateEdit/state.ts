import type { NewPartTemplate } from '@/domain/index';
import type { NewPartTemplateWithInputs } from '@/services/administrators';

export type State = {
  partTemplate?: NewPartTemplateWithInputs;
  form: {
    data: {
      title: string;
      description: string;
      partNumber: string;
      optional: boolean;
    };
    validationMessages: {
      title?: string;
      description?: string;
      partNumber?: string;
      optional?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    saveErrorMessage?: string;
    deleteErrorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'PART_TEMPLATE_LOAD_SUCCEEDED'; payload: NewPartTemplateWithInputs }
  | { type: 'PART_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'TITLE_UPDATED'; payload: string }
  | { type: 'DESCRIPTION_UPDATED'; payload: string }
  | { type: 'PART_NUMBER_UPDATED'; payload: string }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'PART_TEMPLATE_SAVE_STARTED' }
  | { type: 'PART_TEMPLATE_SAVE_SUCCEEDED'; payload: NewPartTemplate }
  | { type: 'PART_TEMPLATE_SAVE_FAILED'; payload?: string }
  | { type: 'PART_TEMPLATE_DELETE_STARTED' }
  | { type: 'PART_TEMPLATE_DELETE_SUCCEEDED' }
  | { type: 'PART_TEMPLATE_DELETE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      title: '',
      description: '',
      partNumber: '1',
      optional: false,
    },
    validationMessages: {},
    processingState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PART_TEMPLATE_LOAD_SUCCEEDED':
      return {
        ...state,
        partTemplate: action.payload,
        form: {
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            partNumber: action.payload.partNumber.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
        },
        error: false,
      };
    case 'PART_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TITLE_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, title: action.payload,
          },
        },
      };
    case 'DESCRIPTION_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, description: action.payload,
          },
        },
      };
    case 'PART_NUMBER_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      } else {
        const points = parseInt(action.payload, 10);
        if (isNaN(points)) {
          validationMessage = 'Invalid number';
        } else if (points < 1) {
          validationMessage = 'Cannot be less than one';
        } else if (points > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, partNumber: action.payload,
          },
          validationMessages: { ...state.form.validationMessages, partNumber: validationMessage },
        },
      };
    }
    case 'OPTIONAL_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, optional: action.payload },
        },
      };
    case 'PART_TEMPLATE_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', saveErrorMessage: undefined },
      };
    case 'PART_TEMPLATE_SAVE_SUCCEEDED':
      if (!state.partTemplate) {
        throw Error('textBoxTemplate is undefined');
      }
      return {
        ...state,
        partTemplate: {
          ...state.partTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            partNumber: action.payload.partNumber.toString(),
            optional: action.payload.optional,
          },
          processingState: 'idle',
        },
      };
    case 'PART_TEMPLATE_SAVE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          saveErrorMessage: action.payload,
        },
      };
    case 'PART_TEMPLATE_DELETE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', deleteErrorMessage: undefined },
      };
    case 'PART_TEMPLATE_DELETE_SUCCEEDED':
      return {
        ...state,
        partTemplate: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            partNumber: '1',
            optional: false,
          },
          processingState: 'idle',
        },
      };
    case 'PART_TEMPLATE_DELETE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'delete error',
          deleteErrorMessage: action.payload,
        },
      };
  }
};
