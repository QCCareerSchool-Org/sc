import type { Material } from '@/domain/material';
import type { MaterialWithUnitWithCourse } from '@/services/administrators/materialService';

type LessonMeta = {
  minutes: string;
  chapters: string;
  videos: string;
  knowledgeChecks: string;
};

export type State = {
  material?: MaterialWithUnitWithCourse;
  form: {
    data: {
      title: string;
      description: string;
      order: string;
      lessonMeta: LessonMeta | null;
    };
    validationMessages: {
      title?: string;
      description?: string;
      order?: string;
      minutes?: string;
      chapters?: string;
      videos?: string;
      knowledgeChecks?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_MATERIAL_SUCCEEDED'; payload: MaterialWithUnitWithCourse }
  | { type: 'LOAD_MATERIAL_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'MINUTES_CHANGED'; payload: string }
  | { type: 'CHAPTERS_CHANGED'; payload: string }
  | { type: 'VIDEOS_CHANGED'; payload: string }
  | { type: 'KNOWLEDGE_CHECKS_CHANGED'; payload: string }
  | { type: 'SAVE_MATERIAL_STARTED' }
  | { type: 'SAVE_MATERIAL_SUCCEEDED'; payload: Material }
  | { type: 'SAVE_MATERIAL_FAILED'; payload?: string }
  | { type: 'DELETE_MATERIAL_STARTED' }
  | { type: 'DELETE_MATERIAL_SUCCEEDED' }
  | { type: 'DELETE_MATERIAL_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      title: '',
      description: '',
      order: '0',
      lessonMeta: null,
    },
    validationMessages: {},
    processingState: 'idle',
    errorMessage: undefined,
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_MATERIAL_SUCCEEDED':
      return {
        ...state,
        material: action.payload,
        form: {
          data: {
            title: action.payload.title,
            description: action.payload.description,
            order: action.payload.order.toString(),
            lessonMeta: action.payload.type === 'lesson' ? {
              minutes: action.payload.minutes?.toString() ?? '',
              chapters: action.payload.chapters?.toString() ?? '',
              videos: action.payload.videos?.toString() ?? '',
              knowledgeChecks: action.payload.knowledgeChecks?.toString() ?? '',
            } : null,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
        error: false,
      };
    case 'LOAD_MATERIAL_FAILED':
      return { ...state, error: true, errorCode: action.payload };
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
    case 'MINUTES_CHANGED':
      return updateLessonMeta(state, 'minutes', action.payload);
    case 'CHAPTERS_CHANGED':
      return updateLessonMeta(state, 'chapters', action.payload);
    case 'VIDEOS_CHANGED':
      return updateLessonMeta(state, 'videos', action.payload);
    case 'KNOWLEDGE_CHECKS_CHANGED':
      return updateLessonMeta(state, 'knowledgeChecks', action.payload);
    case 'SAVE_MATERIAL_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_MATERIAL_SUCCEEDED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      return {
        ...state,
        material: {
          ...state.material,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            order: action.payload.order.toString(),
            lessonMeta: action.payload.type === 'lesson' ? {
              minutes: action.payload.minutes?.toString() ?? '',
              chapters: action.payload.chapters?.toString() ?? '',
              videos: action.payload.videos?.toString() ?? '',
              knowledgeChecks: action.payload.knowledgeChecks?.toString() ?? '',
            } : null,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'SAVE_MATERIAL_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_MATERIAL_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_MATERIAL_SUCCEEDED': {
      return {
        ...state,
        material: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            order: '0',
            lessonMeta: null,
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'DELETE_MATERIAL_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
  }
};

const updateLessonMeta = (state: State, key: keyof LessonMeta, value: string): State => {
  if (!state.form.data.lessonMeta) {
    throw Error('lessonMeta is not set');
  }
  let validationMessage: string | undefined;
  const maxValue = 127;
  const minValue = 0;
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    validationMessage = 'Invalid value';
  } else if (parsedValue < minValue) {
    validationMessage = 'Must be greater than or equal to 0';
  } else if (parsedValue > maxValue) {
    validationMessage = 'Exceeds maximum value';
  }
  return {
    ...state,
    form: {
      ...state.form,
      data: {
        ...state.form.data,
        lessonMeta: {
          ...state.form.data.lessonMeta,
          [key]: value,
        },
      },
      validationMessages: {
        ...state.form.validationMessages,
        [key]: validationMessage,
      },
    },
  };
};
