import type { Course } from '@/domain/course';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { School } from '@/domain/school';
import type { Unit } from '@/domain/unit';

type CourseWithSchoolAndUnitTemplates = Course & {
  school: School;
  newSubmissionTemplates: NewSubmissionTemplate[];
  units: Unit[];
};

export type State = {
  course?: CourseWithSchoolAndUnitTemplates;
  enableForm: {
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  newSubmissionTemplateForm: {
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
  unitForm: {
    data: {
      unitLetter: string;
      title: string;
      order: string;
    };
    validationMessages: {
      unitLetter?: string;
      title?: string;
      order?: string;
    };
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: CourseWithSchoolAndUnitTemplates }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }

  | { type: 'ENABLE_COURSE_STARTED' }
  | { type: 'ENABLE_COURSE_SUCCEEDED'; payload: Course }
  | { type: 'ENABLE_COURSE_FAILED'; payload?: string }

  | { type: 'SUBMISSION_TEMPLATE_UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'SUBMISSION_TEMPLATE_TITLE_CHANGED'; payload: string }
  | { type: 'SUBMISSION_TEMPLATE_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'SUBMISSION_TEMPLATE_MARKING_CRITERIA_CHANGED'; payload: string }
  | { type: 'SUBMISSION_TEMPLATE_ORDER_CHANGED'; payload: string }
  | { type: 'SUBMISSION_TEMPLATE_OPTIONAL_CHANGED'; payload: boolean }
  | { type: 'ADD_SUBMISSION_TEMPLATE_STARTED' }
  | { type: 'ADD_SUBMISSION_TEMPLATE_SUCCEEDED'; payload: NewSubmissionTemplate }
  | { type: 'ADD_SUBMISSION_TEMPLATE_FAILED'; payload?: string }

  | { type: 'UNIT_UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'UNIT_TITLE_CHANGED'; payload: string }
  | { type: 'UNIT_ORDER_CHANGED'; payload: string }
  | { type: 'ADD_UNIT_STARTED' }
  | { type: 'ADD_UNIT_SUCCEEDED'; payload: Unit }
  | { type: 'ADD_UNIT_FAILED'; payload?: string };

export const initialState: State = {
  enableForm: {
    processingState: 'idle',
  },
  newSubmissionTemplateForm: {
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
  },
  unitForm: {
    data: {
      unitLetter: 'A',
      title: '',
      order: '0',
    },
    validationMessages: {},
    processingState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      let unitLetter = 'A';
      if (action.payload.newSubmissionTemplates.length) {
        const nextLetter = String.fromCharCode(Math.max(...action.payload.newSubmissionTemplates.map(u => u.unitLetter.charCodeAt(0))) + 1);
        if (nextLetter < 'Z') {
          unitLetter = nextLetter;
        }
      }
      let materialUnitLetter = 'A';
      if (action.payload.units.length) {
        const nextLetter = String.fromCharCode(Math.max(...action.payload.units.map(u => u.unitLetter.charCodeAt(0))) + 1);
        if (nextLetter < 'Z') {
          materialUnitLetter = nextLetter;
        }
      }
      return {
        ...state,
        course: action.payload,
        newSubmissionTemplateForm: {
          data: {
            unitLetter,
            title: '',
            description: '',
            markingCriteria: '',
            order: action.payload.newSubmissionTemplates.length === 0 ? '0' : Math.max(...action.payload.newSubmissionTemplates.map(u => u.order)).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        unitForm: {
          data: {
            unitLetter: materialUnitLetter,
            title: '',
            order: '0',
          },
          validationMessages: {},
          processingState: 'idle',
        },
        error: false,
      };
    }
    case 'LOAD_DATA_FAILED':
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
    case 'SUBMISSION_TEMPLATE_UNIT_LETTER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else if (action.payload.length > 1) {
        validationMessage = 'Maximum of one character allowed';
      } else if (!/[a-z0-9]/iu.test(action.payload)) {
        validationMessage = 'Only letters A to Z and numbers 0 to 9 are allowed';
      } else if (state.course?.newSubmissionTemplates.some(u => u.unitLetter === action.payload.toUpperCase())) {
        validationMessage = 'Another unit already has this unit letter';
      }
      return {
        ...state,
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: { ...state.newSubmissionTemplateForm.data, unitLetter: action.payload.toUpperCase() },
          validationMessages: { ...state.newSubmissionTemplateForm.validationMessages, unitLetter: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TEMPLATE_TITLE_CHANGED': {
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
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: { ...state.newSubmissionTemplateForm.data, title: action.payload },
          validationMessages: { ...state.newSubmissionTemplateForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TEMPLATE_DESCRIPTION_CHANGED': {
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
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: { ...state.newSubmissionTemplateForm.data, description: action.payload },
          validationMessages: { ...state.newSubmissionTemplateForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TEMPLATE_MARKING_CRITERIA_CHANGED': {
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
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: { ...state.newSubmissionTemplateForm.data, markingCriteria: action.payload },
          validationMessages: { ...state.newSubmissionTemplateForm.validationMessages, markingCriteria: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TEMPLATE_ORDER_CHANGED': {
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
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: { ...state.newSubmissionTemplateForm.data, order: action.payload },
          validationMessages: { ...state.newSubmissionTemplateForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TEMPLATE_OPTIONAL_CHANGED':
      return {
        ...state,
        newSubmissionTemplateForm: { ...state.newSubmissionTemplateForm, data: { ...state.newSubmissionTemplateForm.data, optional: action.payload } },
      };

    case 'ADD_SUBMISSION_TEMPLATE_STARTED':
      return {
        ...state,
        newSubmissionTemplateForm: { ...state.newSubmissionTemplateForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_SUBMISSION_TEMPLATE_SUCCEEDED': {
      if (!state.course) {
        throw Error('course is undefined');
      }
      const newSubmissionTemplates = [ ...state.course.newSubmissionTemplates, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return a.unitLetter.localeCompare(b.unitLetter);
        }
        return a.order - b.order;
      });
      let unitLetter = 'A';
      const nextLetter = String.fromCharCode(Math.max(...newSubmissionTemplates.map(u => u.unitLetter.charCodeAt(0))) + 1);
      if (nextLetter < 'Z') {
        unitLetter = nextLetter;
      }
      return {
        ...state,
        course: {
          ...state.course,
          newSubmissionTemplates,
        },
        newSubmissionTemplateForm: {
          ...state.newSubmissionTemplateForm,
          data: {
            unitLetter,
            title: '',
            description: '',
            markingCriteria: '',
            order: Math.max(...newSubmissionTemplates.map(u => u.order)).toString(),
            optional: false,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_SUBMISSION_TEMPLATE_FAILED':
      return {
        ...state,
        newSubmissionTemplateForm: { ...state.newSubmissionTemplateForm, processingState: 'insert error', errorMessage: action.payload },
      };
    case 'UNIT_UNIT_LETTER_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = 'Required';
      } else if (action.payload.length > 1) {
        validationMessage = 'Maximum of one character allowed';
      } else if (!/[a-z0-9]/iu.test(action.payload)) {
        validationMessage = 'Only letters A to Z and numbers 0 to 9 are allowed';
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
    case 'UNIT_TITLE_CHANGED': {
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
        unitForm: {
          ...state.unitForm,
          data: { ...state.unitForm.data, title: action.payload },
          validationMessages: { ...state.unitForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'UNIT_ORDER_CHANGED': {
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
    case 'ADD_UNIT_STARTED':
      return {
        ...state,
        unitForm: { ...state.unitForm, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_UNIT_SUCCEEDED': {
      if (!state.course) {
        throw Error('course is undefined');
      }
      const units = [ ...state.course.units, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return a.unitLetter.localeCompare(b.unitLetter);
        }
        return a.order - b.order;
      });
      let unitLetter = 'A';
      const nextLetter = String.fromCharCode(Math.max(...units.map(u => u.unitLetter.charCodeAt(0))) + 1);
      if (nextLetter < 'Z') {
        unitLetter = nextLetter;
      }
      return {
        ...state,
        course: {
          ...state.course,
          units,
        },
        unitForm: {
          ...state.unitForm,
          data: {
            unitLetter,
            title: '',
            order: '0',
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_UNIT_FAILED':
      return {
        ...state,
        unitForm: { ...state.unitForm, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
