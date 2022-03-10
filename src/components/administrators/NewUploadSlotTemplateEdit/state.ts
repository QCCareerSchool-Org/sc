import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { NewUploadSlotTemplateWithPart } from '@/services/administrators/newUploadSlotTemplateService';

export type State = {
  newUploadSlotTemplate?: NewUploadSlotTemplateWithPart;
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
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED'; payload: NewUploadSlotTemplateWithPart }
  | { type: 'LOAD_UPLOAD_SLOT_TEMPLATE_FAILED'; payload?: number }
  | { type: 'LABEL_CHANGED'; payload: string }
  | { type: 'IMAGE_CHANGED'; payload: boolean }
  | { type: 'PDF_CHANGED'; payload: boolean }
  | { type: 'WORD_CHANGED'; payload: boolean }
  | { type: 'EXCEL_CHANGED'; payload: boolean }
  | { type: 'POINTS_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_UPLOAD_SLOT_TEMPLATE_STARTED' }
  | { type: 'SAVE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED'; payload: NewUploadSlotTemplate }
  | { type: 'SAVE_UPLOAD_SLOT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_UPLOAD_SLOT_TEMPLATE_STARTED' }
  | { type: 'DELETE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_UPLOAD_SLOT_TEMPLATE_FAILED'; payload?: string };

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
    errorMessage: undefined,
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        newUploadSlotTemplate: action.payload,
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
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_UPLOAD_SLOT_TEMPLATE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'LABEL_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const maxLength = 191;
        const newLength = (new TextEncoder().encode(action.payload).length);
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, label: action.payload },
          validationMessages: { ...state.form.validationMessages, label: validationMessage },
        },
      };
    }
    case 'IMAGE_CHANGED': {
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
    case 'PDF_CHANGED': {
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
    case 'WORD_CHANGED': {
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
    case 'EXCEL_CHANGED': {
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
    case 'POINTS_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
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
    case 'ORDER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
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
    case 'SAVE_UPLOAD_SLOT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED':
      if (!state.newUploadSlotTemplate) {
        throw Error('newUploadSlotTemplate is undefined');
      }
      return {
        ...state,
        newUploadSlotTemplate: {
          ...state.newUploadSlotTemplate,
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
    case 'SAVE_UPLOAD_SLOT_TEMPLATE_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };
    case 'DELETE_UPLOAD_SLOT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_UPLOAD_SLOT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        newUploadSlotTemplate: undefined,
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
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    case 'DELETE_UPLOAD_SLOT_TEMPLATE_FAILED':
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
