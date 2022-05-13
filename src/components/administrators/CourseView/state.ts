import type { Course } from '@/domain/course';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import type { School } from '@/domain/school';

type CourseWithSchoolAndUnitTemplates = Course & {
  school: School;
  newUnitTemplates: NewUnitTemplate[];
};

export type State = {
  course?: CourseWithSchoolAndUnitTemplates;
  enableForm: {
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  newUnitTemplateForm: {
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
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_COURSE_SUCCEEDED'; payload: CourseWithSchoolAndUnitTemplates }
  | { type: 'LOAD_COURSE_FAILED'; payload?: number }
  | { type: 'ENABLE_COURSE_STARTED' }
  | { type: 'ENABLE_COURSE_SUCCEEDED'; payload: Course }
  | { type: 'ENABLE_COURSE_FAILED'; payload?: string }
  | { type: 'UNIT_TEMPLATE_UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_MARKING_CRITERIA_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_ORDER_CHANGED'; payload: string }
  | { type: 'UNIT_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_UNIT_TEMPLATE_STARTED' }
  | { type: 'ADD_UNIT_TEMPLATE_SUCCEEDED'; payload: NewUnitTemplate }
  | { type: 'ADD_UNIT_TEMPLATE_FAILED'; payload?: string };

export const initialState: State = {
  enableForm: {
    processingState: 'idle',
  },
  newUnitTemplateForm: {
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
        newUnitTemplateForm: {
          data: {
            unitLetter,
            title: '',
            description: '',
            markingCriteria: '',
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
    case 'ENABLE_COURSE_STARTED':
      return { ...state, enableForm: { processingState: 'saving', errorMessage: undefined } };
    case 'ENABLE_COURSE_SUCCEEDED':
      if (typeof state.course === 'undefined') {
        throw Error('course is undefined');
      }
      return {
        ...state,
        enableForm: { processingState: 'idle' },
        course: {
          ...state.course,
          ...action.payload,
        },
      };
    case 'ENABLE_COURSE_FAILED':
      return { ...state, enableForm: { processingState: 'save error', errorMessage: action.payload } };
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: { ...state.newUnitTemplateForm.data, unitLetter: action.payload.toUpperCase() },
          validationMessages: { ...state.newUnitTemplateForm.validationMessages, unitLetter: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_TITLE_CHANGED': {
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: { ...state.newUnitTemplateForm.data, title: action.payload },
          validationMessages: { ...state.newUnitTemplateForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_DESCRIPTION_CHANGED': {
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: { ...state.newUnitTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newUnitTemplateForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_MARKING_CRITERIA_CHANGED': {
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: { ...state.newUnitTemplateForm.data, markingCriteria: action.payload },
          validationMessages: { ...state.newUnitTemplateForm.validationMessages, markingCriteria: validationMessage },
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: { ...state.newUnitTemplateForm.data, order: action.payload },
          validationMessages: { ...state.newUnitTemplateForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'UNIT_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        newUnitTemplateForm: { ...state.newUnitTemplateForm, data: { ...state.newUnitTemplateForm.data, optional: action.payload } },
      };

    case 'ADD_UNIT_TEMPLATE_STARTED':
      return {
        ...state,
        newUnitTemplateForm: { ...state.newUnitTemplateForm, processingState: 'inserting', errorMessage: undefined },
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
        newUnitTemplateForm: {
          ...state.newUnitTemplateForm,
          data: {
            unitLetter,
            title: '',
            description: '',
            markingCriteria: '',
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
        newUnitTemplateForm: { ...state.newUnitTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
