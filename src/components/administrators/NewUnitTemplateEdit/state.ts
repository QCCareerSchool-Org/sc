import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import type { NewUnitTemplateWithCourseAndAssignments } from '@/services/administrators/newUnitTemplateService';

export type State = {
  newUnitTemplate?: NewUnitTemplateWithCourseAndAssignments;
  form: {
    data: {
      title: string;
      description: string;
      unitLetter: string;
      order: string;
      optional: boolean;
    };
    validationMessages: {
      title?: string;
      description?: string;
      unitLetter?: string;
      order?: string;
      optional?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  newAssignmentTemplateForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_UNIT_TEMPLATE_SUCCEEDED'; payload: NewUnitTemplateWithCourseAndAssignments }
  | { type: 'LOAD_UNIT_TEMPLATE_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_UNIT_TEMPLATE_STARTED' }
  | { type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED'; payload: NewUnitTemplate }
  | { type: 'SAVE_UNIT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_UNIT_TEMPLATE_STARTED' }
  | { type: 'DELETE_UNIT_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_UNIT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_STARTED' }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED'; payload: NewAssignmentTemplate }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      title: '',
      description: '',
      unitLetter: 'A',
      order: '0',
      optional: false,
    },
    validationMessages: {},
    processingState: 'idle',
    errorMessage: undefined,
  },
  newAssignmentTemplateForm: {
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
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_UNIT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        newUnitTemplate: action.payload,
        form: {
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            unitLetter: action.payload.unitLetter,
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        newAssignmentTemplateForm: {
          data: {
            title: '',
            description: '',
            assignmentNumber: action.payload.newAssignmentTemplates.length === 0 ? '1' : (Math.max(...action.payload.newAssignmentTemplates.map(a => a.assignmentNumber)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_UNIT_TEMPLATE_FAILED':
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
    case 'UNIT_LETTER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else if (action.payload.length > 1) {
        validationMessage = 'Maximum of one character allowed';
      } else if (!/[a-z0-9]/iu.test(action.payload)) {
        validationMessage = 'Only letters A to Z and number 0 to 9 are allowed';
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, unitLetter: action.payload.toUpperCase() },
          validationMessages: { ...state.form.validationMessages, unitLetter: validationMessage },
        },
      };
    }
    case 'ORDER_CHANGED': {
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
        form: {
          ...state.form,
          data: { ...state.form.data, order: action.payload },
          validationMessages: { ...state.form.validationMessages, order: validationMessage },
        },
      };
    }
    case 'OPTIONAL_CHANGED':
      return {
        ...state,
        form: { ...state.form, data: { ...state.form.data, optional: action.payload } },
      };
    case 'SAVE_UNIT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_UNIT_TEMPLATE_SUCCEEDED': {
      if (!state.newUnitTemplate) {
        throw Error('newUnitTemplate is undefined');
      }
      return {
        ...state,
        newUnitTemplate: {
          ...state.newUnitTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            unitLetter: action.payload.unitLetter,
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'SAVE_UNIT_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_UNIT_TEMPLATE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_UNIT_TEMPLATE_SUCCEEDED': {
      if (!state.newUnitTemplate) {
        throw Error('newUnitTemplate is undefined');
      }
      return {
        ...state,
        newUnitTemplate: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            unitLetter: 'A',
            order: '0',
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'DELETE_UNIT_TEMPLATE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED': {
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
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, title: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED': {
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
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else {
        const assignmentNumber = parseInt(action.payload, 10);
        if (isNaN(assignmentNumber)) {
          validationMessage = 'Invalid number';
        } else if (assignmentNumber < 0) {
          validationMessage = 'Cannot be less than zero';
        } else if (assignmentNumber > 127) {
          validationMessage = 'Cannot be greater than 127';
        } else if (state.newUnitTemplate?.newAssignmentTemplates.some(a => a.assignmentNumber === assignmentNumber)) {
          validationMessage = 'Another assignment already has this assignment number';
        }
      }
      return {
        ...state,
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, assignmentNumber: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, assignmentNumber: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED': {
      return {
        ...state,
        newAssignmentTemplateForm: { ...state.newAssignmentTemplateForm, data: { ...state.newAssignmentTemplateForm.data, optional: action.payload } },
      };
    }
    case 'ADD_ASSIGNMENT_TEMPLATE_STARTED':
      return {
        ...state,
        newAssignmentTemplateForm: { ...state.newAssignmentTemplateForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED': {
      if (!state.newUnitTemplate) {
        throw Error('newUnitTemplate is undefined');
      }
      const newAssignmentTemplates = [ ...state.newUnitTemplate.newAssignmentTemplates, action.payload ].sort((a, b) => a.assignmentNumber - b.assignmentNumber);
      return {
        ...state,
        newUnitTemplate: {
          ...state.newUnitTemplate,
          newAssignmentTemplates,
        },
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: {
            title: '',
            description: '',
            assignmentNumber: (Math.max(...newAssignmentTemplates.map(a => a.assignmentNumber)) + 1).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_ASSIGNMENT_TEMPLATE_FAILED':
      return {
        ...state,
        newAssignmentTemplateForm: { ...state.newAssignmentTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
