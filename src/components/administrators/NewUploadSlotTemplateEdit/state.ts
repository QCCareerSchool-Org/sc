import type { NewUploadSlotTemplate } from '@/domain/index';
import type { NewUploadSlotTemplateWithPart } from '@/services/administrators';

export type State = {
  uploadSlotTemplate?: NewUploadSlotTemplateWithPart;
  form: {
    data: {
      label: string;
      points: string;
      allowedTypes: {
        image: boolean;
        pdf: boolean;
        word: boolean;
        excel: boolean;
      };
      order: string;
      optional: boolean;
    };
    validationMessages: {
      label?: string;
      allowedTypes?: string;
      points?: string;
      order?: string;
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
  | { type: 'UPLOAD_SLOT_TEMPLATE_LOAD_SUCCEEDED'; payload: NewUploadSlotTemplateWithPart }
  | { type: 'UPLOAD_SLOT_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'LABEL_UPDATED'; payload: string }
  | { type: 'IMAGE_UPDATED'; payload: boolean }
  | { type: 'PDF_UPDATED'; payload: boolean }
  | { type: 'WORD_UPDATED'; payload: boolean }
  | { type: 'EXCEL_UPDATED'; payload: boolean }
  | { type: 'POINTS_UPDATED'; payload: string }
  | { type: 'ORDER_UPDATED'; payload: string }
  | { type: 'OPTIONAL_UPDATED'; payload: boolean }
  | { type: 'UPLOAD_SLOT_TEMPLATE_SAVE_STARTED' }
  | { type: 'UPLOAD_SLOT_TEMPLATE_SAVE_SUCCEEDED'; payload: NewUploadSlotTemplate }
  | { type: 'UPLOAD_SLOT_TEMPLATE_SAVE_FAILED'; payload?: string }
  | { type: 'UPLOAD_SLOT_TEMPLATE_DELETE_STARTED' }
  | { type: 'UPLOAD_SLOT_TEMPLATE_DELETE_SUCCEEDED' }
  | { type: 'UPLOAD_SLOT_TEMPLATE_DELETE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      label: '',
      allowedTypes: {
        image: true,
        pdf: false,
        word: false,
        excel: false,
      },
      points: '1',
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
    case 'UPLOAD_SLOT_TEMPLATE_LOAD_SUCCEEDED':
      return {
        ...state,
        uploadSlotTemplate: action.payload,
        form: {
          data: {
            label: action.payload.label ?? '',
            allowedTypes: {
              image: action.payload.allowedTypes.includes('image'),
              pdf: action.payload.allowedTypes.includes('pdf'),
              word: action.payload.allowedTypes.includes('word'),
              excel: action.payload.allowedTypes.includes('excel'),
            },
            points: action.payload.points.toString(),
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
        },
        error: false,
      };
    case 'UPLOAD_SLOT_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'LABEL_UPDATED':
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data, label: action.payload,
          },
        },
      };
    case 'IMAGE_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.form.data.allowedTypes.pdf && !state.form.data.allowedTypes.word && !state.form.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, allowedTypes: { ...state.form.data.allowedTypes, image: action.payload } },
          validationMessages: { ...state.form.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'PDF_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.form.data.allowedTypes.image && !state.form.data.allowedTypes.word && !state.form.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, allowedTypes: { ...state.form.data.allowedTypes, pdf: action.payload } },
          validationMessages: { ...state.form.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'WORD_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.form.data.allowedTypes.image && !state.form.data.allowedTypes.pdf && !state.form.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, allowedTypes: { ...state.form.data.allowedTypes, word: action.payload } },
          validationMessages: { ...state.form.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'EXCEL_UPDATED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.form.data.allowedTypes.image && !state.form.data.allowedTypes.pdf && !state.form.data.allowedTypes.word) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, allowedTypes: { ...state.form.data.allowedTypes, excel: action.payload } },
          validationMessages: { ...state.form.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
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
    case 'UPLOAD_SLOT_TEMPLATE_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', saveErrorMessage: undefined },
      };
    case 'UPLOAD_SLOT_TEMPLATE_SAVE_SUCCEEDED':
      if (!state.uploadSlotTemplate) {
        throw Error('uploadSlotTemplate is undefined');
      }
      return {
        ...state,
        uploadSlotTemplate: {
          ...state.uploadSlotTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            label: action.payload.label ?? '',
            allowedTypes: {
              image: action.payload.allowedTypes.includes('image'),
              pdf: action.payload.allowedTypes.includes('pdf'),
              word: action.payload.allowedTypes.includes('word'),
              excel: action.payload.allowedTypes.includes('excel'),
            },
            points: action.payload.points.toString(),
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          processingState: 'idle',
        },
      };
    case 'UPLOAD_SLOT_TEMPLATE_SAVE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          saveErrorMessage: action.payload,
        },
      };
    case 'UPLOAD_SLOT_TEMPLATE_DELETE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', deleteErrorMessage: undefined },
      };
    case 'UPLOAD_SLOT_TEMPLATE_DELETE_SUCCEEDED':
      return {
        ...state,
        uploadSlotTemplate: undefined,
        form: {
          ...state.form,
          data: {
            label: '',
            allowedTypes: {
              image: true,
              pdf: false,
              word: false,
              excel: false,
            },
            points: '1',
            order: '0',
            optional: false,
          },
          processingState: 'idle',
        },
      };
    case 'UPLOAD_SLOT_TEMPLATE_DELETE_FAILED':
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
