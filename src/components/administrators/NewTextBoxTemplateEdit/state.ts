import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewTextBoxTemplateWithPart } from '@/services/administrators';

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
  | { type: 'TEXT_BOX_TEMPLATE_LOAD_SUCCEEDED'; payload: NewTextBoxTemplateWithPart }
  | { type: 'TEXT_BOX_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'DESCRIPTION_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: string }
  | { type: 'LINES_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: string }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_STARTED' }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED'; payload: NewTextBoxTemplate }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_FAILED'; payload?: string }
  | { type: 'TEXT_BOX_TEMPLATE_DELETE_STARTED' }
  | { type: 'TEXT_BOX_TEMPLATE_DELETE_SUCCEEDED' }
  | { type: 'TEXT_BOX_TEMPLATE_DELETE_FAILED'; payload?: string };

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
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TEXT_BOX_TEMPLATE_LOAD_SUCCEEDED':
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
        },
        error: false,
      };
    case 'TEXT_BOX_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
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
    case 'POINTS_UPDATED': {
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
    case 'LINES_UPDATED': {
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
    case 'ORDER_UPDATED': {
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
    case 'OPTIONAL_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, optional: action.payload },
        },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED':
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
          processingState: 'idle',
        },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };
    case 'TEXT_BOX_TEMPLATE_DELETE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'TEXT_BOX_TEMPLATE_DELETE_SUCCEEDED':
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
          processingState: 'idle',
        },
      };
    case 'TEXT_BOX_TEMPLATE_DELETE_FAILED':
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
