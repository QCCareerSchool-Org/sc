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
  detailsForm: {
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
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error' | 'success';
    errorMessage?: string;
  };
  imageForm: {
    data: {
      image: File | null;
    };
    validationMessages: {
      image?: string;
    };
    /** used for forcing react to refresh the dom */
    key: number;
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error' | 'success';
    errorMessage?: string;
  };
  contentForm: {
    data: {
      content: File | null;
    };
    validationMessages: {
      content?: string;
    };
    /** used for forcing react to refresh the dom */
    key: number;
    processingState: 'idle' | 'saving' | 'save error' | 'success';
    errorMessage?: string;
  };
  /** used for cache busting */
  imageVersion: string;
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
  | { type: 'SAVE_MATERIAL_DETAILS_STARTED' }
  | { type: 'SAVE_MATERIAL_DETAILS_SUCCEEDED'; payload: Material }
  | { type: 'SAVE_MATERIAL_DETAILS_FAILED'; payload?: string }
  | { type: 'DELETE_MATERIAL_STARTED' }
  | { type: 'DELETE_MATERIAL_SUCCEEDED' }
  | { type: 'DELETE_MATERIAL_FAILED'; payload?: string }
  | { type: 'MATERIAL_IMAGE_CHANGED'; payload: File | null }
  | { type: 'REPLACE_MATERIAL_IMAGE_STARTED' }
  | { type: 'REPLACE_MATERIAL_IMAGE_SUCCEEDED'; payload: Material }
  | { type: 'REPLACE_MATERIAL_IMAGE_FAILED'; payload?: string }
  | { type: 'DELETE_MATERIAL_IMAGE_STARTED' }
  | { type: 'DELETE_MATERIAL_IMAGE_SUCCEEDED'; payload: Material }
  | { type: 'DELETE_MATERIAL_IMAGE_FAILED'; payload?: string }
  | { type: 'MATERIAL_CONTENT_CHANGED'; payload: File | null }
  | { type: 'REPLACE_MATERIAL_CONTENT_STARTED' }
  | { type: 'REPLACE_MATERIAL_CONTENT_SUCCEEDED'; payload: Material }
  | { type: 'REPLACE_MATERIAL_CONTENT_FAILED'; payload?: string };

export const initialState: State = {
  detailsForm: {
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
  imageForm: {
    data: { image: null },
    validationMessages: {},
    key: 0,
    processingState: 'idle',
  },
  contentForm: {
    data: { content: null },
    validationMessages: {},
    key: 0,
    processingState: 'idle',
  },
  imageVersion: Math.random().toString(32).slice(2),
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_MATERIAL_SUCCEEDED':
      return {
        ...state,
        material: action.payload,
        detailsForm: {
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
        detailsForm: {
          ...state.detailsForm,
          data: { ...state.detailsForm.data, title: action.payload },
          validationMessages: { ...state.detailsForm.validationMessages, title: validationMessage },
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
        detailsForm: {
          ...state.detailsForm,
          data: { ...state.detailsForm.data, description: action.payload },
          validationMessages: { ...state.detailsForm.validationMessages, description: validationMessage },
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
        detailsForm: {
          ...state.detailsForm,
          data: { ...state.detailsForm.data, order: action.payload },
          validationMessages: { ...state.detailsForm.validationMessages, order: validationMessage },
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
    case 'SAVE_MATERIAL_DETAILS_STARTED':
      return {
        ...state,
        detailsForm: { ...state.detailsForm, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_MATERIAL_DETAILS_SUCCEEDED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      return {
        ...state,
        material: {
          ...state.material,
          ...action.payload,
        },
        detailsForm: {
          ...state.detailsForm,
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
          processingState: 'success',
          errorMessage: undefined,
        },
      };
    }
    case 'SAVE_MATERIAL_DETAILS_FAILED':
      return {
        ...state,
        detailsForm: { ...state.detailsForm, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_MATERIAL_STARTED':
      return {
        ...state,
        detailsForm: { ...state.detailsForm, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_MATERIAL_SUCCEEDED': {
      return {
        ...state,
        material: undefined,
        detailsForm: {
          ...state.detailsForm,
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
        detailsForm: { ...state.detailsForm, processingState: 'save error', errorMessage: action.payload },
      };
    case 'MATERIAL_IMAGE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        const maxSize = 524_288; // 512 KiB
        if (action.payload.size > maxSize) {
          validationMessage = 'File exceeds maximum size';
        }
      }
      return {
        ...state,
        imageForm: {
          ...state.imageForm,
          data: { ...state.imageForm.data, image: action.payload },
          validationMessages: { ...state.imageForm.validationMessages, image: validationMessage },
        },
      };
    }
    case 'REPLACE_MATERIAL_IMAGE_STARTED':
      return {
        ...state,
        imageForm: { ...state.imageForm, processingState: 'saving', errorMessage: undefined },
      };
    case 'REPLACE_MATERIAL_IMAGE_SUCCEEDED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      return {
        ...state,
        material: {
          ...state.material,
          ...action.payload,
        },
        imageForm: {
          ...state.imageForm,
          data: { image: null },
          validationMessages: {},
          key: state.imageForm.key === Number.MAX_SAFE_INTEGER ? 0 : state.imageForm.key + 1,
          processingState: 'success',
          errorMessage: undefined,
        },
        imageVersion: Math.random().toString(32).slice(2),
      };
    }
    case 'REPLACE_MATERIAL_IMAGE_FAILED':
      return {
        ...state,
        imageForm: { ...state.imageForm, processingState: 'save error', errorMessage: action.payload },
      };
    case 'DELETE_MATERIAL_IMAGE_STARTED':
      return {
        ...state,
        imageForm: { ...state.imageForm, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_MATERIAL_IMAGE_SUCCEEDED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      return {
        ...state,
        material: {
          ...state.material,
          ...action.payload,
        },
        imageForm: {
          ...state.imageForm,
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'DELETE_MATERIAL_IMAGE_FAILED':
      return {
        ...state,
        imageForm: { ...state.imageForm, processingState: 'delete error', errorMessage: action.payload },
      };
    case 'MATERIAL_CONTENT_CHANGED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      let validationMessage: string | undefined;
      if (action.payload) {
        if (state.material.type === 'lesson') {
          const maxSize = 67_108_864; // 64 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else {
          const maxSize = 16_777_216; // 16 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        }
      }
      return {
        ...state,
        contentForm: {
          ...state.contentForm,
          data: { ...state.imageForm.data, content: action.payload },
          validationMessages: { ...state.imageForm.validationMessages, content: validationMessage },
        },
      };
    }
    case 'REPLACE_MATERIAL_CONTENT_STARTED':
      return {
        ...state,
        contentForm: { ...state.contentForm, processingState: 'saving', errorMessage: undefined },
      };
    case 'REPLACE_MATERIAL_CONTENT_SUCCEEDED': {
      if (!state.material) {
        throw Error('material is undefined');
      }
      return {
        ...state,
        material: {
          ...state.material,
          ...action.payload,
        },
        contentForm: {
          ...state.contentForm,
          data: { content: null },
          validationMessages: {},
          key: state.contentForm.key === Number.MAX_SAFE_INTEGER ? 0 : state.contentForm.key + 1,
          processingState: 'success',
          errorMessage: undefined,
        },
      };
    }
    case 'REPLACE_MATERIAL_CONTENT_FAILED':
      return {
        ...state,
        contentForm: { ...state.contentForm, processingState: 'save error', errorMessage: action.payload },
      };
  }
};

const updateLessonMeta = (state: State, key: keyof LessonMeta, value: string): State => {
  if (!state.detailsForm.data.lessonMeta) {
    throw Error('lessonMeta is not set');
  }
  let validationMessage: string | undefined;
  const maxValue = 65_536;
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
    detailsForm: {
      ...state.detailsForm,
      data: {
        ...state.detailsForm.data,
        lessonMeta: {
          ...state.detailsForm.data.lessonMeta,
          [key]: value,
        },
      },
      validationMessages: {
        ...state.detailsForm.validationMessages,
        [key]: validationMessage,
      },
    },
  };
};
