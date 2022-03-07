import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewTextBoxTemplateWithPart } from '@/services/administrators/newTextBoxTemplateService';

export type State = {
  textBoxTemplate?: NewTextBoxTemplateWithPart;
  form: {
    data: {
      description: string;
      points: string;
      lines: string;
      order: string;
      optional: boolean;
    };
    validationMessages: {
      description?: string;
      points?: string;
      lines?: string;
      order?: string;
      optional?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_TEXT_BOX_TEMPLATE_SUCCEEDED'; payload: NewTextBoxTemplateWithPart }
  | { type: 'LOAD_TEXT_BOX_TEMPLATE_FAILED'; payload?: number }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'POINTS_CHANGED'; payload: string }
  | { type: 'LINES_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_TEXT_BOX_TEMPLATE_STARTED' }
  | { type: 'SAVE_TEXT_BOX_TEMPLATE_SUCCEEDED'; payload: NewTextBoxTemplate }
  | { type: 'SAVE_TEXT_BOX_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_TEXT_BOX_TEMPLATE_STARTED' }
  | { type: 'DELETE_TEXT_BOX_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_TEXT_BOX_TEMPLATE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      description: '',
      points: '1',
      lines: '',
      order: '0',
      optional: false,
    },
    validationMessages: {},
    processingState: 'idle',
    errorMessage: undefined,
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_TEXT_BOX_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        textBoxTemplate: action.payload,
        form: {
          data: {
            description: action.payload.description ?? '',
            points: action.payload.points.toString(),
            lines: action.payload.lines === null ? '' : action.payload.lines.toString(),
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_TEXT_BOX_TEMPLATE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'DESCRIPTION_CHANGED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, description: action.payload,
          },
        },
      };
    case 'POINTS_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      } else {
        const points = parseInt(action.payload, 10);
        if (isNaN(points)) {
          validationMessage = 'Invalid number';
        } else if (points < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (points > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, points: action.payload,
          },
          validationMessages: { ...state.form.validationMessages, points: validationMessage },
        },
      };
    }
    case 'LINES_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const parsedLines = parseInt(action.payload, 10);
        if (isNaN(parsedLines)) {
          validationMessage = 'Invalid number';
        } else if (parsedLines < 1) {
          validationMessage = 'Cannot be less than one';
        } else if (parsedLines > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, lines: action.payload,
          },
          validationMessages: { ...state.form.validationMessages, lines: validationMessage },
        },
      };
    }
    case 'ORDER_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
        validationMessage = 'Required';
      } else {
        const points = parseInt(action.payload, 10);
        if (isNaN(points)) {
          validationMessage = 'Invalid number';
        } else if (points < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (points > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, order: action.payload,
          },
          validationMessages: { ...state.form.validationMessages, order: validationMessage },
        },
      };
    }
    case 'OPTIONAL_CHANGED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, optional: action.payload },
        },
      };
    case 'SAVE_TEXT_BOX_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_TEXT_BOX_TEMPLATE_SUCCEEDED':
      if (!state.textBoxTemplate) {
        throw Error('textBoxTemplate is undefined');
      }
      return {
        ...state,
        textBoxTemplate: {
          ...state.textBoxTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            description: action.payload.description ?? '',
            points: action.payload.points.toString(),
            lines: action.payload.lines === null ? '' : action.payload.lines.toString(),
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    case 'SAVE_TEXT_BOX_TEMPLATE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };
    case 'DELETE_TEXT_BOX_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_TEXT_BOX_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        textBoxTemplate: undefined,
        form: {
          ...state.form,
          data: {
            description: '',
            points: '1',
            lines: '',
            order: '0',
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    case 'DELETE_TEXT_BOX_TEMPLATE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'delete error',
          errorMessage: action.payload,
        },
      };
  }
};
