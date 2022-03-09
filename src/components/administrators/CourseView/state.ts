import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import type { CourseWithSchoolAndUnits } from '@/services/administrators/courseService';

export type State = {
  course?: CourseWithSchoolAndUnits;
  unitForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'LOAD_COURSE_SUCCEEDED'; payload: CourseWithSchoolAndUnits }
  | { type: 'LOAD_COURSE_FAILED'; payload?: number }
  | { type: 'UNIT_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_ORDER_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_UNIT_TEMPLATE_STARTED' }
  | { type: 'ADD_UNIT_TEMPLATE_SUCCEEDED'; payload: NewUnitTemplate }
  | { type: 'ADD_UNIT_TEMPLATE_FAILED'; payload?: string };

export const initialState: State = {
  unitForm: {
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
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_COURSE_SUCCEEDED': {
      let unitLetter = 'A';
      if (action.payload.newUnitTemplates.length) {
        const nextLetter = String.fromCharCode(Math.max(...action.payload.newUnitTemplates.map(u => u.unitLetter.charCodeAt(0))) + 1);
        if (nextLetter < 'Z') {
          unitLetter = nextLetter;
        }
      }
      return {
        ...state,
        course: action.payload,
        unitForm: {
          data: {
            title: '',
            description: '',
            unitLetter,
            order: action.payload.newUnitTemplates.length === 0 ? '0' : Math.max(...action.payload.newUnitTemplates.map(u => u.order)).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    }
    case 'LOAD_COURSE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'UNIT_TEMPLATE_TITLE_CHANGED': {
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
        unitForm: {
          ...state.unitForm,
          data: { ...state.unitForm.data, title: action.payload },
          validationMessages: { ...state.unitForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_DESCRIPTION_CHANGED': {
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
        unitForm: {
          ...state.unitForm,
          data: { ...state.unitForm.data, description: action.payload },
          validationMessages: { ...state.unitForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_UNIT_LETTER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else if (action.payload.length > 1) {
        validationMessage = 'Maximum of one character allowed';
      } else if (!/[a-z0-9]/iu.test(action.payload)) {
        validationMessage = 'Only letters A to Z and numbers 0 to 9 are allowed';
      } else if (state.course?.newUnitTemplates.some(u => u.unitLetter === action.payload.toUpperCase())) {
        validationMessage = 'Another unit already has this unit letter';
      }
      return {
        ...state,
        unitForm: {
          ...state.unitForm,
          data: { ...state.unitForm.data, unitLetter: action.payload.toUpperCase() },
          validationMessages: { ...state.unitForm.validationMessages, unitLetter: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_ORDER_CHANGED': {
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
        unitForm: {
          ...state.unitForm,
          data: { ...state.unitForm.data, order: action.payload },
          validationMessages: { ...state.unitForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        unitForm: { ...state.unitForm, data: { ...state.unitForm.data, optional: action.payload } },
      };

    case 'ADD_UNIT_TEMPLATE_STARTED':
      return {
        ...state,
        unitForm: { ...state.unitForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_UNIT_TEMPLATE_SUCCEEDED': {
      if (!state.course) {
        throw Error('course is undefined');
      }
      const newUnitTemplates = [ ...state.course.newUnitTemplates, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return a.unitLetter.localeCompare(b.unitLetter);
        }
        return a.order - b.order;
      });
      let unitLetter = 'A';
      const nextLetter = String.fromCharCode(Math.max(...newUnitTemplates.map(u => u.unitLetter.charCodeAt(0))) + 1);
      if (nextLetter < 'Z') {
        unitLetter = nextLetter;
      }
      return {
        ...state,
        course: {
          ...state.course,
          newUnitTemplates,
        },
        unitForm: {
          ...state.unitForm,
          data: {
            title: '',
            description: '',
            unitLetter,
            order: Math.max(...newUnitTemplates.map(u => u.order)).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_UNIT_TEMPLATE_FAILED':
      return {
        ...state,
        unitForm: { ...state.unitForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
