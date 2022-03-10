import sanitizeHtml from 'sanitize-html';

import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { NewPartTemplateWithAssignmentAndInputs } from '@/services/administrators/newPartTemplateService';
import { uuidService } from '@/services/index';

const sanitize = (input: string): string => {
  return sanitizeHtml(input, {
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': [ 'class' ] },
  });
};

export type State = {
  newPartTemplate?: NewPartTemplateWithAssignmentAndInputs;
  form: {
    data: {
      title: string;
      description: string;
      descriptionType: string;
      partNumber: string;
    };
    validationMessages: {
      title?: string;
      description?: string;
      descriptionType?: string;
      partNumber?: string;
    };
    meta: {
      sanitizedHtml: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  newTextBoxTemplateForm: {
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
  newUoloadSlotTemplateForm: {
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
  | { type: 'LOAD_PART_TEMPLATE_SUCCEEDED'; payload: NewPartTemplateWithAssignmentAndInputs }
  | { type: 'LOAD_PART_TEMPLATE_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_TYPE_CHANGED'; payload: string }
  | { type: 'PART_NUMBER_CHANGED'; payload: string }
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
      descriptionType: 'text',
      partNumber: '1',
    },
    validationMessages: {},
    meta: {
      sanitizedHtml: '',
    },
    processingState: 'idle',
    errorMessage: undefined,
  },
  newTextBoxTemplateForm: {
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
  newUoloadSlotTemplateForm: {
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
            descriptionType: action.payload.descriptionType,
            partNumber: action.payload.partNumber.toString(),
          },
          validationMessages: {},
          meta: {
            sanitizedHtml: action.payload.description !== null && action.payload.descriptionType === 'html' ? sanitize(action.payload.description) : '',
          },
          processingState: 'idle',
          errorMessage: undefined,
        },
        newPartTemplate: action.payload,
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: {
            description: '',
            points: '1',
            lines: '',
            order: action.payload.newTextBoxTemplates.length === 0 ? '0' : (Math.max(...action.payload.newTextBoxTemplates.map(t => t.order)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: {
            label: '',
            points: '1',
            allowedTypes: {
              image: true,
              pdf: false,
              word: false,
              excel: false,
            },
            order: action.payload.newUploadSlotTemplates.length === 0 ? '0' : (Math.max(...action.payload.newUploadSlotTemplates.map(u => u.order)) + 1).toString(),
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
          meta: {
            sanitizedHtml: state.form.data.descriptionType === 'html' ? sanitize(action.payload) : '',
          },
        },
      };
    }
    case 'DESCRIPTION_TYPE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        if (![ 'text', 'html' ].includes(action.payload)) {
          validationMessage = 'Invalid value';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, descriptionType: action.payload },
          validationMessages: { ...state.form.validationMessages, descriptionType: validationMessage },
          meta: {
            sanitizedHtml: action.payload === 'text' ? '' : sanitize(state.form.data.description),
          },
        },
      };
    }
    case 'PART_NUMBER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
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
    case 'SAVE_PART_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_PART_TEMPLATE_SUCCEEDED':
      if (!state.newPartTemplate) {
        throw Error('newPartTemplate is undefined');
      }
      return {
        ...state,
        newPartTemplate: {
          ...state.newPartTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            descriptionType: action.payload.descriptionType,
            partNumber: action.payload.partNumber.toString(),
          },
          meta: {
            sanitizedHtml: action.payload.description !== null && action.payload.descriptionType === 'html' ? sanitize(action.payload.description) : '',
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
        newPartTemplate: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            descriptionType: 'text',
            partNumber: '1',
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
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: { ...state.newTextBoxTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newTextBoxTemplateForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_POINTS_CHANGED': {
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
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: { ...state.newTextBoxTemplateForm.data, points: action.payload },
          validationMessages: { ...state.newTextBoxTemplateForm.validationMessages, points: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_LINES_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const lines = parseInt(action.payload, 10);
        if (isNaN(lines)) {
          validationMessage = 'Invalid number';
        } else if (lines < 1) {
          validationMessage = 'Cannot be less than one';
        } else if (lines > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: { ...state.newTextBoxTemplateForm.data, lines: action.payload },
          validationMessages: { ...state.newTextBoxTemplateForm.validationMessages, lines: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_ORDER_CHANGED': {
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
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: { ...state.newTextBoxTemplateForm.data, order: action.payload },
          validationMessages: { ...state.newTextBoxTemplateForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'TEXT_BOX_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        newTextBoxTemplateForm: { ...state.newTextBoxTemplateForm, data: { ...state.newTextBoxTemplateForm.data, optional: action.payload } },
      };
    case 'ADD_TEXT_BOX_TEMPLATE_STARTED':
      return {
        ...state,
        newTextBoxTemplateForm: { ...state.newTextBoxTemplateForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_TEXT_BOX_TEMPLATE_SUCCEEDED': {
      if (!state.newPartTemplate) {
        throw Error('newPartTemplate is undefined');
      }
      const newTextBoxTemplates = [ ...state.newPartTemplate.newTextBoxTemplates, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.textBoxTemplateId, b.textBoxTemplateId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        newPartTemplate: {
          ...state.newPartTemplate,
          newTextBoxTemplates,
        },
        newTextBoxTemplateForm: {
          ...state.newTextBoxTemplateForm,
          data: {
            description: '',
            points: '1',
            lines: '',
            order: (Math.max(...newTextBoxTemplates.map(t => t.order)) + 1).toString(),
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
        newTextBoxTemplateForm: { ...state.newTextBoxTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
    case 'UPLOAD_SLOT_TEMPLATE_LABEL_CHANGED': {
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
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, label: action.payload },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, label: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_POINTS_CHANGED': {
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
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, points: action.payload },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, points: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_ORDER_CHANGED': {
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
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, order: action.payload },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_IMAGE_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.newUoloadSlotTemplateForm.data.allowedTypes.pdf && !state.newUoloadSlotTemplateForm.data.allowedTypes.word && !state.newUoloadSlotTemplateForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, allowedTypes: { ...state.newUoloadSlotTemplateForm.data.allowedTypes, image: action.payload } },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_PDF_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.newUoloadSlotTemplateForm.data.allowedTypes.image && !state.newUoloadSlotTemplateForm.data.allowedTypes.word && !state.newUoloadSlotTemplateForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, allowedTypes: { ...state.newUoloadSlotTemplateForm.data.allowedTypes, pdf: action.payload } },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_WORD_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.newUoloadSlotTemplateForm.data.allowedTypes.image && !state.newUoloadSlotTemplateForm.data.allowedTypes.pdf && !state.newUoloadSlotTemplateForm.data.allowedTypes.excel) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, allowedTypes: { ...state.newUoloadSlotTemplateForm.data.allowedTypes, word: action.payload } },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_EXCEL_CHANGED': {
      let validationMessage: string | undefined;
      if (!action.payload && !state.newUoloadSlotTemplateForm.data.allowedTypes.image && !state.newUoloadSlotTemplateForm.data.allowedTypes.pdf && !state.newUoloadSlotTemplateForm.data.allowedTypes.word) {
        validationMessage = 'At least one type required';
      }
      return {
        ...state,
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: { ...state.newUoloadSlotTemplateForm.data, allowedTypes: { ...state.newUoloadSlotTemplateForm.data.allowedTypes, excel: action.payload } },
          validationMessages: { ...state.newUoloadSlotTemplateForm.validationMessages, allowedTypes: validationMessage },
        },
      };
    }
    case 'UPLOAD_SLOT_TEMPLATE_OPTIONAL_CHANGED':
      return { ...state, newUoloadSlotTemplateForm: { ...state.newUoloadSlotTemplateForm, data: { ...state.newUoloadSlotTemplateForm.data, optional: action.payload } } };
    case 'ADD_UPLOAD_SLOT_TEMPLATE_STARTED':
      return { ...state, newUoloadSlotTemplateForm: { ...state.newUoloadSlotTemplateForm, processingState: 'inserting', errorMessage: undefined } };
    case 'ADD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED': {
      if (!state.newPartTemplate) {
        throw Error('newPartTemplate is undefined');
      }
      const newUploadSlotTemplates = [ ...state.newPartTemplate.newUploadSlotTemplates, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.uploadSlotTemplateId, b.uploadSlotTemplateId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        newPartTemplate: {
          ...state.newPartTemplate,
          newUploadSlotTemplates,
        },
        newUoloadSlotTemplateForm: {
          ...state.newUoloadSlotTemplateForm,
          data: {
            label: '',
            points: '1',
            allowedTypes: {
              image: true,
              pdf: false,
              word: false,
              excel: false,
            },
            order: (Math.max(...newUploadSlotTemplates.map(u => u.order)) + 1).toString(),
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
        newUoloadSlotTemplateForm: { ...state.newUoloadSlotTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
