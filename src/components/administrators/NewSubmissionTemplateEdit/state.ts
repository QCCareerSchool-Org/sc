import type { NewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { NewSubmissionTemplateWithCourseAndAssignments } from '@/services/administrators/newSubmissionTemplateService';
import { sanitize } from 'src/sanitize';

export type State = {
  newSubmissionTemplate?: NewSubmissionTemplateWithCourseAndAssignments;
  form: {
    data: {
      unitLetter: string;
      title: string;
      description: string;
      markingCriteria: string;
      order: string;
      optional: boolean;
    };
    validationMessages: {
      unitLetter?: string;
      title?: string;
      description?: string;
      markingCriteria?: string;
      order?: string;
      optional?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  newAssignmentTemplateForm: {
    data: {
      assignmentNumber: string;
      title: string;
      description: string;
      descriptionType: string;
      markingCriteria: string;
      optional: boolean;
    };
    validationMessages: {
      assignmentNumber?: string;
      title?: string;
      description?: string;
      descriptionType?: string;
      markingCriteria?: string;
      optional?: string;
    };
    meta: {
      sanitizedHtml: string;
    };
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_UNIT_TEMPLATE_SUCCEEDED'; payload: NewSubmissionTemplateWithCourseAndAssignments }
  | { type: 'LOAD_UNIT_TEMPLATE_FAILED'; payload?: number }
  | { type: 'UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'MARKING_CRITERIA_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'SAVE_UNIT_TEMPLATE_STARTED' }
  | { type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED'; payload: NewSubmissionTemplate }
  | { type: 'SAVE_UNIT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'DELETE_UNIT_TEMPLATE_STARTED' }
  | { type: 'DELETE_UNIT_TEMPLATE_SUCCEEDED' }
  | { type: 'DELETE_UNIT_TEMPLATE_FAILED'; payload?: string }
  | { type: 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_TYPE_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_MARKING_CRITERIA_CHANGED'; payload: string }
  | { type: 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_STARTED' }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED'; payload: NewAssignmentTemplate }
  | { type: 'ADD_ASSIGNMENT_TEMPLATE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      unitLetter: 'A',
      title: '',
      description: '',
      markingCriteria: '',
      order: '0',
      optional: false,
    },
    validationMessages: {},
    processingState: 'idle',
    errorMessage: undefined,
  },
  newAssignmentTemplateForm: {
    data: {
      assignmentNumber: '1',
      title: '',
      description: '',
      descriptionType: 'text',
      markingCriteria: '',
      optional: false,
    },
    validationMessages: {},
    meta: {
      sanitizedHtml: '',
    },
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
        newSubmissionTemplate: action.payload,
        form: {
          data: {
            unitLetter: action.payload.unitLetter,
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            markingCriteria: action.payload.markingCriteria ?? '',
            order: action.payload.order.toString(),
            optional: action.payload.optional,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        newAssignmentTemplateForm: {
          data: {
            assignmentNumber: action.payload.newAssignmentTemplates.length === 0 ? '1' : (Math.max(...action.payload.newAssignmentTemplates.map(a => a.assignmentNumber)) + 1).toString(),
            title: '',
            description: '',
            descriptionType: 'text',
            markingCriteria: '',
            optional: false,
          },
          validationMessages: {},
          meta: {
            sanitizedHtml: '',
          },
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_UNIT_TEMPLATE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
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
    case 'TITLE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 191;
        const newLength = [ ...action.payload ].length;
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
        const newLength = [ ...action.payload ].length;
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
    case 'MARKING_CRITERIA_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 65_535;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, markingCriteria: action.payload },
          validationMessages: { ...state.form.validationMessages, markingCriteria: validationMessage },
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
      if (!state.newSubmissionTemplate) {
        throw Error('newSubmissionTemplate is undefined');
      }
      return {
        ...state,
        newSubmissionTemplate: {
          ...state.newSubmissionTemplate,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            unitLetter: action.payload.unitLetter,
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            markingCriteria: action.payload.markingCriteria ?? '',
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
      if (!state.newSubmissionTemplate) {
        throw Error('newSubmissionTemplate is undefined');
      }
      return {
        ...state,
        newSubmissionTemplate: undefined,
        form: {
          ...state.form,
          data: {
            unitLetter: 'A',
            title: '',
            description: '',
            markingCriteria: '',
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
        } else if (state.newSubmissionTemplate?.newAssignmentTemplates.some(a => a.assignmentNumber === assignmentNumber)) {
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
    case 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 191;
        const newLength = [ ...action.payload ].length;
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
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'ASSIGNMENT_TEMPLATE_DESCRIPTION_TYPE_CHANGED': {
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
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, descriptionType: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, descriptionType: validationMessage },
          meta: {
            sanitizedHtml: action.payload === 'text' ? '' : sanitize(state.newAssignmentTemplateForm.data.description),
          },
        },
      };
    }
    case 'ASSIGNMENT_TEMPLATE_MARKING_CRITERIA_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxLength = 65_535;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: { ...state.newAssignmentTemplateForm.data, markingCriteria: action.payload },
          validationMessages: { ...state.newAssignmentTemplateForm.validationMessages, markingCriteria: validationMessage },
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
      if (!state.newSubmissionTemplate) {
        throw Error('newSubmissionTemplate is undefined');
      }
      const newAssignmentTemplates = [ ...state.newSubmissionTemplate.newAssignmentTemplates, action.payload ].sort((a, b) => a.assignmentNumber - b.assignmentNumber);
      return {
        ...state,
        newSubmissionTemplate: {
          ...state.newSubmissionTemplate,
          newAssignmentTemplates,
        },
        newAssignmentTemplateForm: {
          ...state.newAssignmentTemplateForm,
          data: {
            assignmentNumber: (Math.max(...newAssignmentTemplates.map(a => a.assignmentNumber)) + 1).toString(),
            title: '',
            description: '',
            descriptionType: 'text',
            markingCriteria: '',
            optional: false,
          },
          validationMessages: {},
          meta: {
            sanitizedHtml: '',
          },
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
