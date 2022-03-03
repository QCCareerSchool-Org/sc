import type { NewTextBoxTemplateWithPart } from '@/services/administrators';

export type State = {
  textBoxTemplate?: NewTextBoxTemplateWithPart;
  form: {
    data: {
      description: string;
      points: number;
      lines: string;
      order: number;
      optional: boolean;
    };
    saveState: 'idle' | 'processing' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'TEXT_BOX_TEMPLATE_LOAD_SUCCEEDED'; payload: NewTextBoxTemplateWithPart }
  | { type: 'TEXT_BOX_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'DESCRIPTION_UPDATED'; payload: string }
  | { type: 'POINTS_UPDATED'; payload: number }
  | { type: 'LINES_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: number }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_STARTED' }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED'; payload: NewTextBoxTemplateWithPart }
  | { type: 'TEXT_BOX_TEMPLATE_SAVE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      description: '',
      points: 1,
      lines: '',
      order: 0,
      optional: false,
    },
    saveState: 'idle',
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
            points: action.payload.points,
            lines: action.payload.lines === null ? '' : action.payload.lines.toString(),
            order: action.payload.order,
            optional: action.payload.optional,
          },
          saveState: 'idle',
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
    case 'POINTS_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, points: action.payload,
          },
        },
      };
    case 'LINES_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, lines: action.payload,
          },
        },
      };
    case 'ORDER_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, order: action.payload,
          },
        },
      };
    case 'OPTIONAL_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, optional: action.payload,
          },
        },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, saveState: 'processing' },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED':
      return {
        ...state,
        textBoxTemplate: action.payload,
        form: {
          ...state.form,
          data: {
            description: action.payload.description ?? '',
            points: action.payload.points,
            lines: action.payload.lines === null ? '' : action.payload.lines.toString(),
            order: action.payload.order,
            optional: action.payload.optional,
          },
          saveState: 'idle',
        },
      };
    case 'TEXT_BOX_TEMPLATE_SAVE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          saveState: 'error',
          errorMessage: action.payload,
        },
      };
  }
};
