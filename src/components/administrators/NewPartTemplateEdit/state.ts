import type { NewPartTemplate, NewTextBoxTemplate, NewUploadSlotTemplate } from '@/domain/index';
import type { NewPartTemplateWithInputs } from '@/services/administrators';
import { uuidService } from '@/services/index';

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
    errorMessage?: string;
  };
  textBoxForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  uploadSlotForm: {
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
      points?: string;
      allowedTypes?: string;
      order?: string;
      optional?: string;
    };
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_PART_TEMPLATE_SUCCEEDED'; payload: NewPartTemplateWithInputs }
  | { type: 'LOAD_PART_TEMPLATE_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'PART_NUMBER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_PART_TEMPLATE_STARTED' }
  | { type: 'SAVE_PART_TEMPLATE_SUCCEEDED'; payload: NewPartTemplate }
  | { type: 'SAVE_PART_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_PART_TEMPLATE_STARTED' }
  | { type: 'DELETE_PART_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_PART_TEMPLATE_FAILED'; payload?: string }
  | { type: 'TEXT_BOX_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'TEXT_BOX_TEMPLATE_POINTS_CHANGED'; payload: string }
  | { type: 'TEXT_BOX_TEMPLATE_LINES_CHANGED'; payload: string }
  | { type: 'TEXT_BOX_TEMPLATE_ORDER_CHANGED'; payload: string }
  | { type: 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_TEXT_BOX_TEMPLATE_STARTED' }
  | { type: 'ADD_TEXT_BOX_TEMPLATE_SUCCEEDED'; payload: NewTextBoxTemplate }
  | { type: 'ADD_TEXT_BOX_TEMPLATE_FAILED'; payload?: string }
  | { type: 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED'; payload: string }
  | { type: 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED'; payload: string }
  | { type: 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED'; payload: string }
  | { type: 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED'; payload: boolean }
  | { type: 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED'; payload: boolean }
  | { type: 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED'; payload: boolean }
  | { type: 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED'; payload: boolean }
  | { type: 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_UPLOAD_SLOT_TEMPLATE_STARTED' }
  | { type: 'ADD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED'; payload: NewUploadSlotTemplate }
  | { type: 'ADD_UPLOAD_SLOT_TEMPLATE_FAILED'; payload?: string };

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
    errorMessage: undefined,
  },
  textBoxForm: {
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
  uploadSlotForm: {
    data: {
      label: '',
      points: '1',
      allowedTypes: {
        image: true,
        pdf: false,
        word: false,
        excel: false,
      },
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
    case 'LOAD_PART_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        form: {
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            partNumber: action.payload.partNumber.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        partTemplate: action.payload,
        textBoxForm: {
          ...state.textBoxForm,
          data: {
            description: '',
            points: '1',
            lines: '',
            order: action.payload.textBoxes.length === 0 ? '0' : (Math.max(...action.payload.textBoxes.map(t => t.order)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: {
            label: '',
            points: '1',
            allowedTypes: {
              image: true,
              pdf: false,
              word: false,
              excel: false,
            },
            order: action.payload.uploadSlots.length === 0 ? '0' : (Math.max(...action.payload.uploadSlots.map(u => u.order)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_PART_TEMPLATE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TITLE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
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
          data: { ...state.form.data, title: action.payload },
          validationMessages: { ...state.form.validationMessages, title: validationMessage },
        },
      };
    }
    case 'DESCRIPTION_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 65_535;
        const newLength = (new TextEncoder().encode(action.payload).length);
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, description: action.payload },
          validationMessages: { ...state.form.validationMessages, description: validationMessage },
        },
      };
    }
    case 'PART_NUMBER_CHANGED': {
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
          data: { ...state.form.data, partNumber: action.payload },
          validationMessages: { ...state.form.validationMessages, partNumber: validationMessage },
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
    case 'SAVE_PART_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_PART_TEMPLATE_SUCCEEDED':
      if (!state.partTemplate) {
        throw Error('partTemplate is undefined');
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
    case 'SAVE_PART_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_PART_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_PART_TEMPLATE_SUCCEEDED':
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
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    case 'DELETE_PART_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'delete error', errorMessage: action.payload },
      };
    case 'TEXT_BOX_TEMPLATE_DESCRIPTION_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 65_535;
        const newLength = (new TextEncoder().encode(action.payload).length);
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        textBoxForm: {
          ...state.textBoxForm,
          data: { ...state.textBoxForm.data, description: action.payload },
          validationMessages: { ...state.textBoxForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_POINTS_CHANGED': {
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
        textBoxForm: {
          ...state.textBoxForm,
          data: { ...state.textBoxForm.data, points: action.payload },
          validationMessages: { ...state.textBoxForm.validationMessages, points: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_LINES_CHANGED': {
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
        textBoxForm: {
          ...state.textBoxForm,
          data: { ...state.textBoxForm.data, lines: action.payload },
          validationMessages: { ...state.textBoxForm.validationMessages, lines: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_ORDER_CHANGED': {
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
        textBoxForm: {
          ...state.textBoxForm,
          data: { ...state.textBoxForm.data, order: action.payload },
          validationMessages: { ...state.textBoxForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        textBoxForm: { ...state.textBoxForm, data: { ...state.textBoxForm.data, optional: action.payload } },
      };
    case 'ADD_TEXT_BOX_TEMPLATE_STARTED':
      return {
        ...state,
        textBoxForm: { ...state.textBoxForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_TEXT_BOX_TEMPLATE_SUCCEEDED': {
      if (!state.partTemplate) {
        throw Error('partTemplate is undefined');
      }
      const textBoxes = [ ...state.partTemplate.textBoxes, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.textBoxId, b.textBoxId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        partTemplate: {
          ...state.partTemplate,
          textBoxes,
        },
        textBoxForm: {
          ...state.textBoxForm,
          data: {
            description: '',
            points: '1',
            lines: '',
            order: (Math.max(...textBoxes.map(t => t.order)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_TEXT_BOX_TEMPLATE_FAILED':
      return {
        ...state,
        textBoxForm: { ...state.textBoxForm, processingState: 'insert error', errorMessage: action.payload },
      };
    case 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload) {
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
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, label: action.payload },
          validationMessages: { ...state.uploadSlotForm.validationMessages, label: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED': {
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
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, points: action.payload },
          validationMessages: { ...state.uploadSlotForm.validationMessages, points: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED': {
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
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, order: action.payload },
          validationMessages: { ...state.uploadSlotForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.uploadSlotForm.data.allowedTypes.pdf && !state.uploadSlotForm.data.allowedTypes.word && !state.uploadSlotForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, allowedTypes: { ...state.uploadSlotForm.data.allowedTypes, image: action.payload } },
          validationMessages: { ...state.uploadSlotForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.uploadSlotForm.data.allowedTypes.image && !state.uploadSlotForm.data.allowedTypes.word && !state.uploadSlotForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, allowedTypes: { ...state.uploadSlotForm.data.allowedTypes, pdf: action.payload } },
          validationMessages: { ...state.uploadSlotForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.uploadSlotForm.data.allowedTypes.image && !state.uploadSlotForm.data.allowedTypes.pdf && !state.uploadSlotForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, allowedTypes: { ...state.uploadSlotForm.data.allowedTypes, word: action.payload } },
          validationMessages: { ...state.uploadSlotForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.uploadSlotForm.data.allowedTypes.image && !state.uploadSlotForm.data.allowedTypes.pdf && !state.uploadSlotForm.data.allowedTypes.word) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: { ...state.uploadSlotForm.data, allowedTypes: { ...state.uploadSlotForm.data.allowedTypes, excel: action.payload } },
          validationMessages: { ...state.uploadSlotForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED':
      return { ...state, uploadSlotForm: { ...state.uploadSlotForm, data: { ...state.uploadSlotForm.data, optional: action.payload } } };
    case 'ADD_UPLOAD_SLOT_TEMPLATE_STARTED':
      return { ...state, uploadSlotForm: { ...state.uploadSlotForm, processingState: 'inserting', errorMessage: undefined } };
    case 'ADD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED': {
      if (!state.partTemplate) {
        throw Error('partTemplate is undefined');
      }
      const uploadSlots = [ ...state.partTemplate.uploadSlots, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.uploadSlotId, b.uploadSlotId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        partTemplate: {
          ...state.partTemplate,
          uploadSlots,
        },
        uploadSlotForm: {
          ...state.uploadSlotForm,
          data: {
            label: '',
            points: '1',
            allowedTypes: {
              image: true,
              pdf: false,
              word: false,
              excel: false,
            },
            order: (Math.max(...uploadSlots.map(u => u.order)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_UPLOAD_SLOT_TEMPLATE_FAILED':
      return {
        ...state,
        uploadSlotForm: { ...state.uploadSlotForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
