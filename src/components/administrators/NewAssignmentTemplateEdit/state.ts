import { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewAssignmentTemplateWithUnitAndParts } from '@/services/administrators/newAssignmentTemplateService';
import { uuidService } from '@/services/index';
import { sanitize } from 'src/sanitize';

export type State = {
  newAssignmentTemplate?: NewAssignmentTemplateWithUnitAndParts;
  form: {
    data: {
      title: string;
      description: string;
      assignmentNumber: string;
      optional: boolean;
    };
    validationMessages: {
      title?: string;
      description?: string;
      assignmentNumber?: string;
      optional?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  newPartTemplateForm: {
    data: {
      title: string;
      description: string;
      descriptionType: string;
      partNumber: string;
      optional: boolean;
    };
    validationMessages: {
      title?: string;
      description?: string;
      descriptionType?: string;
      partNumber?: string;
      optional?: string;
    };
    meta: {
      sanitizedHtml: string;
    };
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  assignmentMediaForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    progress: number;
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED'; payload: NewAssignmentTemplateWithUnitAndParts }
  | { type: 'LOAD_ASSIGNMENT_TEMPLATE_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_NUMBER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_ASSIGNMENT_TEMPLATE_STARTED' }
  | { type: 'SAVE_ASSIGNMENT_TEMPLATE_SUCCEEDED'; payload: NewAssignmentTemplate }
  | { type: 'SAVE_ASSIGNMENT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_ASSIGNMENT_TEMPLATE_STARTED' }
  | { type: 'DELETE_ASSIGNMENT_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_ASSIGNMENT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'PART_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'PART_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'PART_TEMPLATE_DESCRIPTION_TYPE_CHANGED'; payload: string }
  | { type: 'PART_TEMPLATE_PART_NUMBER_CHANGED'; payload: string }
  | { type: 'PART_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_PART_TEMPLATE_STARTED' }
  | { type: 'ADD_PART_TEMPLATE_SUCCEEDED'; payload: NewPartTemplate }
  | { type: 'ADD_PART_TEMPLATE_FAILED'; payload?: string }
  | { type: 'ASSIGNMENT_MEDIA_CAPTION_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_MEDIA_ORDER_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_MEDIA_DATA_SOURCE_CHANGED'; payload: 'file upload' | 'url' }
  | { type: 'ASSIGNMENT_MEDIA_FILE_CHANGED'; payload: File | null }
  | { type: 'ASSIGNMENT_MEDIA_EXTERNAL_DATA_CHANGED'; payload: string }
  | { type: 'ADD_ASSIGNMENT_MEDIUM_STARTED' }
  | { type: 'ADD_ASSIGNMENT_MEDIUM_PROGRESSED'; payload: number }
  | { type: 'ADD_ASSIGNMENT_MEDIUM_SUCCEEDED'; payload: NewAssignmentMedium }
  | { type: 'ADD_ASSIGNMENT_MEDIUM_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      title: '',
      description: '',
      assignmentNumber: '1',
      optional: false,
    },
    validationMessages: {},
    processingState: 'idle',
  },
  newPartTemplateForm: {
    data: {
      title: '',
      description: '',
      descriptionType: 'text',
      partNumber: '1',
      optional: false,
    },
    validationMessages: {},
    meta: {
      sanitizedHtml: '',
    },
    processingState: 'idle',
  },
  assignmentMediaForm: {
    data: {
      caption: '',
      order: '0',
      dataSource: 'file upload',
      file: null,
      externalData: '',
    },
    validationMessages: {},
    processingState: 'idle',
    progress: 0,
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        newAssignmentTemplate: action.payload,
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            assignmentNumber: action.payload.assignmentNumber.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: {
            title: '',
            description: '',
            descriptionType: 'text',
            partNumber: action.payload.newPartTemplates.length === 0 ? '1' : (Math.max(...action.payload.newPartTemplates.map(p => p.partNumber)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          meta: {
            sanitizedHtml: '',
          },
          processingState: 'idle',
          errorMessage: undefined,
        },
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: {
            dataSource: 'file upload',
            caption: '',
            order: action.payload.newAssignmentMedia.length === 0 ? '0' : Math.max(...action.payload.newAssignmentMedia.map(m => m.order)).toString(),
            file: null,
            externalData: '',
          },
          validationMessages: {},
          processingState: 'idle',
          progress: 0,
        },
        error: false,
      };
    case 'LOAD_ASSIGNMENT_TEMPLATE_FAILED':
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
    case 'ASSIGNMENT_NUMBER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const partNumber = parseInt(action.payload, 10);
        if (isNaN(partNumber)) {
          validationMessage = 'Invalid number';
        } else if (partNumber < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (partNumber > 127) {
          validationMessage = 'Cannot be greater than 127';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, assignmentNumber: action.payload },
          validationMessages: { ...state.form.validationMessages, assignmentNumber: validationMessage },
        },
      };
    }
    case 'OPTIONAL_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, optional: action.payload } },
      };
    case 'SAVE_ASSIGNMENT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_ASSIGNMENT_TEMPLATE_SUCCEEDED':
      if (!state.newAssignmentTemplate) {
        throw Error('newAssignmentTemplate is undefined');
      }
      return {
        ...state,
        newAssignmentTemplate: {
          ...state.newAssignmentTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            assignmentNumber: action.payload.assignmentNumber.toString(),
            optional: action.payload.optional,
          },
          processingState: 'idle',
        },
      };
    case 'SAVE_ASSIGNMENT_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_ASSIGNMENT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_ASSIGNMENT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        newAssignmentTemplate: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            assignmentNumber: '1',
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    case 'DELETE_ASSIGNMENT_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'delete error', errorMessage: action.payload },
      };
    case 'PART_TEMPLATE_TITLE_CHANGED': {
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
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: { ...state.newPartTemplateForm.data, title: action.payload },
          validationMessages: { ...state.newPartTemplateForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'PART_TEMPLATE_DESCRIPTION_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length) {
        const maxLength = 65_535;
        const newLength = (new TextEncoder().encode(action.payload).length);
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: { ...state.newPartTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newPartTemplateForm.validationMessages, description: validationMessage },
          meta: {
            sanitizedHtml: state.newPartTemplateForm.data.descriptionType === 'html' ? sanitize(action.payload) : '',
          },
        },
      };
    }
    case 'PART_TEMPLATE_DESCRIPTION_TYPE_CHANGED': {
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
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: { ...state.newPartTemplateForm.data, descriptionType: action.payload },
          validationMessages: { ...state.newPartTemplateForm.validationMessages, descriptionType: validationMessage },
          meta: {
            sanitizedHtml: action.payload === 'text' ? '' : sanitize(state.newPartTemplateForm.data.description),
          },
        },
      };
    }
    case 'PART_TEMPLATE_PART_NUMBER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const partNumber = parseInt(action.payload, 10);
        if (isNaN(partNumber)) {
          validationMessage = 'Invalid number';
        } else if (partNumber < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (partNumber > 127) {
          validationMessage = 'Cannot be greater than 127';
        } else if (state.newAssignmentTemplate?.newPartTemplates.some(p => p.partNumber === partNumber)) {
          validationMessage = 'Another part already has this part number';
        }
      }
      return {
        ...state,
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: { ...state.newPartTemplateForm.data, partNumber: action.payload },
          validationMessages: { ...state.form.validationMessages, partNumber: validationMessage },
        },
      };
    }
    case 'PART_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        newPartTemplateForm: { ...state.newPartTemplateForm, data: { ...state.newPartTemplateForm.data, optional: action.payload } },
      };
    case 'ADD_PART_TEMPLATE_STARTED':
      return {
        ...state,
        newPartTemplateForm: { ...state.newPartTemplateForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_PART_TEMPLATE_SUCCEEDED': {
      if (!state.newAssignmentTemplate) {
        throw Error('newAssignmentTemplate is undefined');
      }
      const newPartTemplates = [ ...state.newAssignmentTemplate.newPartTemplates, action.payload ].sort((a, b) => a.partNumber - b.partNumber);
      return {
        ...state,
        newAssignmentTemplate: {
          ...state.newAssignmentTemplate,
          newPartTemplates,
        },
        newPartTemplateForm: {
          ...state.newPartTemplateForm,
          data: {
            title: '',
            description: '',
            descriptionType: 'text',
            partNumber: (Math.max(...newPartTemplates.map(p => p.partNumber)) + 1).toString(),
            optional: false,
          },
          processingState: 'idle',
        },
      };
    }
    case 'ADD_PART_TEMPLATE_FAILED':
      return {
        ...state,
        newPartTemplateForm: { ...state.newPartTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
    case 'ASSIGNMENT_MEDIA_CAPTION_CHANGED': {
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
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: { ...state.assignmentMediaForm.data, caption: action.payload },
          validationMessages: { ...state.assignmentMediaForm.validationMessages, caption: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_MEDIA_ORDER_CHANGED': {
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
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: { ...state.assignmentMediaForm.data, order: action.payload },
          validationMessages: { ...state.assignmentMediaForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_MEDIA_DATA_SOURCE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else if (![ 'file upload', 'url' ].includes(action.payload)) {
        validationMessage = 'Invalid';
      }
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: { ...state.assignmentMediaForm.data, dataSource: action.payload },
          validationMessages: { ...state.assignmentMediaForm.validationMessages, dataSource: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_MEDIA_FILE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        if (action.payload.size >= 33_554_432) {
          validationMessage = 'Maximum file size of 32 MB exceeded';
        }
      }
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: { ...state.assignmentMediaForm.data, file: action.payload },
          validationMessages: { ...state.assignmentMediaForm.validationMessages, file: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_MEDIA_EXTERNAL_DATA_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        if (!action.payload.startsWith('https://')) {
          validationMessage = 'Must start with https://';
        }
      }
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: { ...state.assignmentMediaForm.data, externalData: action.payload },
          validationMessages: { ...state.assignmentMediaForm.validationMessages, externalData: validationMessage },
        },
      };
    }
    case 'ADD_ASSIGNMENT_MEDIUM_STARTED':
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          processingState: 'inserting',
          progress: 0,
          errorMessage: undefined,
        },
      };
    case 'ADD_ASSIGNMENT_MEDIUM_PROGRESSED':
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          progress: action.payload,
        },
      };
    case 'ADD_ASSIGNMENT_MEDIUM_SUCCEEDED': {
      if (!state.newAssignmentTemplate) {
        throw Error('newAssignmentTemplate is undefined');
      }
      const newAssignmentMedia = [ ...state.newAssignmentTemplate.newAssignmentMedia, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.assignmentMediumId, b.assignmentMediumId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        newAssignmentTemplate: {
          ...state.newAssignmentTemplate,
          newAssignmentMedia,
        },
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          data: {
            ...state.assignmentMediaForm.data,
            caption: '',
            order: Math.max(...newAssignmentMedia.map(m => m.order)).toString(),
            file: null,
            externalData: '',
          },
          processingState: 'idle',
          progress: 100,
        },
      };
    }
    case 'ADD_ASSIGNMENT_MEDIUM_FAILED':
      return {
        ...state,
        assignmentMediaForm: {
          ...state.assignmentMediaForm,
          processingState: 'insert error',
          progress: 0,
          errorMessage: action.payload,
        },
      };
  }
};
