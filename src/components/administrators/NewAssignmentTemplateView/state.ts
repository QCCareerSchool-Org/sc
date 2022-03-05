import type { NewPartTemplate } from '@/domain/newPartTemplate';
import type { NewAssignmentTemplateWithParts } from '@/services/administrators';

export type State = {
  assignmentTemplate?: NewAssignmentTemplateWithParts;
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
    saveState: 'idle' | 'processing' | 'error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED'; payload: NewAssignmentTemplateWithParts }
  | { type: 'UNIT_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'PART_NUMBER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'PART_ADD_STARTED' }
  | { type: 'PART_ADD_SUCCEEDED'; payload: NewPartTemplate }
  | { type: 'PART_ADD_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      title: '',
      description: '',
      partNumber: '1',
      optional: false,
    },
    validationMessages: {},
    saveState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UNIT_TEMPLATE_LOAD_SUCCEEDED':
      return {
        ...state,
        assignmentTemplate: action.payload,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            partNumber: action.payload.parts.length === 0 ? '1' : (Math.max(...action.payload.parts.map(p => p.partNumber)) + 1).toString(),
            optional: false,
          },
        },
        error: false,
      };
    case 'UNIT_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TITLE_CHANGED':
      return { ...state, form: { ...state.form, data: { ...state.form.data, title: action.payload } } };
    case 'DESCRIPTION_CHANGED':
      return { ...state, form: { ...state.form, data: { ...state.form.data, description: action.payload } } };
    case 'PART_NUMBER_CHANGED': {
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
          validationMessages: { ...state.form.validationMessages, partNumber: validationMessage },
        },
      };
    }
    case 'OPTIONAL_CHANGED':
      return { ...state, form: { ...state.form, data: { ...state.form.data, optional: action.payload } } };
    case 'PART_ADD_STARTED':
      return { ...state, form: { ...state.form, saveState: 'processing', errorMessage: undefined } };
    case 'PART_ADD_SUCCEEDED':
      if (!state.assignmentTemplate) {
        throw Error('assignmentTemplate is undefined');
      }
      return {
        ...state,
        assignmentTemplate: {
          ...state.assignmentTemplate,
          parts: [ ...state.assignmentTemplate.parts, action.payload ].sort((a, b) => a.partNumber - b.partNumber),
        },
        form: { ...state.form, saveState: 'idle' },
      };
    case 'PART_ADD_FAILED':
      return { ...state, form: { ...state.form, saveState: 'error', errorMessage: action.payload } };

  }
};
