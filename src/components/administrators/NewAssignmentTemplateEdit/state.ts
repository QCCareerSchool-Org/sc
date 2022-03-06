import { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewAssignmentTemplateWithParts } from '@/services/administrators';

export type State = {
  assignmentTemplate?: NewAssignmentTemplateWithParts;
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
  partForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'ASSIGNMENT_TEMPLATE_LOAD_SUCCEEDED'; payload: NewAssignmentTemplateWithParts }
  | { type: 'ASSIGNMENT_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_NUMBER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ASSIGNMENT_TEMPLATE_SAVE_STARTED' }
  | { type: 'ASSIGNMENT_TEMPLATE_SAVE_SUCCEEDED'; payload: NewAssignmentTemplate }
  | { type: 'ASSIGNMENT_TEMPLATE_SAVE_FAILED'; payload?: string }
  | { type: 'ASSIGNMENT_TEMPLATE_DELETE_STARTED' }
  | { type: 'ASSIGNMENT_TEMPLATE_DELETE_SUCCEEDED' }
  | { type: 'ASSIGNMENT_TEMPLATE_DELETE_FAILED'; payload?: string }
  | { type: 'PART_TITLE_CHANGED'; payload: string }
  | { type: 'PART_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'PART_PART_NUMBER_CHANGED'; payload: string }
  | { type: 'PART_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_PART_STARTED' }
  | { type: 'ADD_PART_SUCCEEDED'; payload: NewPartTemplate }
  | { type: 'ADD_PART_FAILED'; payload?: string };

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
  partForm: {
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
    case 'ASSIGNMENT_TEMPLATE_LOAD_SUCCEEDED':
      return {
        ...state,
        assignmentTemplate: action.payload,
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
        partForm: {
          ...state.partForm,
          data: {
            title: '',
            description: '',
            partNumber: action.payload.parts.length === 0 ? '1' : (Math.max(...action.payload.parts.map(p => p.partNumber)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'ASSIGNMENT_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TITLE_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, title: action.payload } },
      };
    case 'DESCRIPTION_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, description: action.payload } },
      };
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
          data: { ...state.form.data, description: action.payload },
          validationMessages: { ...state.form.validationMessages, assignmentNumber: validationMessage },
        },
      };
    }
    case 'OPTIONAL_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, optional: action.payload } },
      };
    case 'ASSIGNMENT_TEMPLATE_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'ASSIGNMENT_TEMPLATE_SAVE_SUCCEEDED':
      if (!state.assignmentTemplate) {
        throw Error('assignmentTemplate is undefined');
      }
      return {
        ...state,
        assignmentTemplate: {
          ...state.assignmentTemplate,
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
    case 'ASSIGNMENT_TEMPLATE_SAVE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'ASSIGNMENT_TEMPLATE_DELETE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'ASSIGNMENT_TEMPLATE_DELETE_SUCCEEDED':
      return {
        ...state,
        assignmentTemplate: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            assignmentNumber: '1',
            optional: false,
          },
          processingState: 'idle',
        },
      };
    case 'ASSIGNMENT_TEMPLATE_DELETE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'delete error', errorMessage: action.payload },
      };
    case 'PART_TITLE_CHANGED':
      return {
        ...state,
        partForm: { ...state.partForm, data: { ...state.partForm.data, title: action.payload } },
      };
    case 'PART_DESCRIPTION_CHANGED':
      return {
        ...state,
        partForm: { ...state.partForm, data: { ...state.partForm.data, description: action.payload } },
      };
    case 'PART_PART_NUMBER_CHANGED': {
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
        partForm: {
          ...state.partForm,
          data: { ...state.partForm.data, description: action.payload },
          validationMessages: { ...state.form.validationMessages, partNumber: validationMessage },
        },
      };
    }
    case 'PART_OPTIONAL_CHANGED':
      return {
        ...state,
        partForm: { ...state.partForm, data: { ...state.partForm.data, optional: action.payload } },
      };
    case 'ADD_PART_STARTED':
      return {
        ...state,
        partForm: { ...state.partForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_PART_SUCCEEDED': {
      if (!state.assignmentTemplate) {
        throw Error('assignmentTemplate is undefined');
      }
      const parts = [ ...state.assignmentTemplate.parts, action.payload ].sort((a, b) => a.partNumber - b.partNumber);
      return {
        ...state,
        assignmentTemplate: {
          ...state.assignmentTemplate,
          parts,
        },
        partForm: {
          ...state.partForm,
          data: {
            title: '',
            description: '',
            partNumber: (Math.max(...parts.map(p => p.partNumber)) + 1).toString(),
            optional: false,
          },
          processingState: 'idle',
        },
      };
    }
    case 'ADD_PART_FAILED':
      return {
        ...state,
        partForm: { ...state.partForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
