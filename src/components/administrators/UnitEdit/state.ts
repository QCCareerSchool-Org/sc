import type { Material, MaterialType } from '@/domain/material';
import type { Unit } from '@/domain/unit';

type UnitWithMaterials = Unit & {
  materials: Material[];
};

type LessonMeta = {
  minutes: string;
  chapters: string;
  videos: string;
  knowledgeChecks: string;
};

export type State = {
  unit?: UnitWithMaterials;
  form: {
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
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  materialForm: {
    data: {
      type: MaterialType;
      title: string;
      description: string;
      order: string;
      content: File | null;
      image: File | null;
      externalData: string;
      lessonMeta: LessonMeta | null;
    };
    validationMessages: {
      type?: string;
      title?: string;
      description?: string;
      order?: string;
      content?: string;
      image?: string;
      externalData?: string;
      minutes?: string;
      chapters?: string;
      videos?: string;
      knowledgeChecks?: string;
    };
    progress: number;
    contentKey: number;
    imageKey: number;
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: UnitWithMaterials }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }

  | { type: 'UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'SAVE_UNIT_STARTED' }
  | { type: 'SAVE_UNIT_SUCEEDED'; payload: Unit }
  | { type: 'SAVE_UNIT_FAILED'; payload?: string }
  | { type: 'DELETE_UNIT_STARTED' }
  | { type: 'DELETE_UNIT_SUCEEDED' }
  | { type: 'DELETE_UNIT_FAILED'; payload?: string }
  | { type: 'MATERIAL_TYPE_CHANGED'; payload: string }
  | { type: 'MATERIAL_TITLE_CHANGED'; payload: string }
  | { type: 'MATERIAL_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'MATERIAL_ORDER_CHANGED'; payload: string }
  | { type: 'MATERIAL_CONTENT_CHANGED'; payload: File | null }
  | { type: 'MATERIAL_IMAGE_CHANGED'; payload: File | null }
  | { type: 'MATERIAL_EXTERNAL_DATA_CHANGED'; payload: string }
  | { type: 'MATERIAL_MINUTES_CHANGED'; payload: string }
  | { type: 'MATERIAL_CHAPTERS_CHANGED'; payload: string }
  | { type: 'MATERIAL_VIDEOS_CHANGED'; payload: string }
  | { type: 'MATERIAL_KNOWLEDGE_CHECKS_CHANGED'; payload: string }
  | { type: 'ADD_MATERIAL_STARTED' }
  | { type: 'ADD_MATERIAL_PROGRESSED'; payload: number }
  | { type: 'ADD_MATERIAL_SUCCEEDED'; payload: Material }
  | { type: 'ADD_MATERIAL_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      unitLetter: 'A',
      title: '',
      order: '0',
    },
    validationMessages: {},
    processingState: 'idle',
  },
  materialForm: {
    data: {
      type: 'lesson',
      title: '',
      description: '',
      order: '0',
      content: null,
      image: null,
      externalData: '',
      lessonMeta: {
        minutes: '0',
        chapters: '0',
        videos: '0',
        knowledgeChecks: '0',
      },
    },
    validationMessages: {},
    progress: 0,
    contentKey: 0,
    imageKey: 0,
    processingState: 'idle',
  },
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      return {
        ...state,
        unit: action.payload,
        form: {
          data: {
            unitLetter: action.payload.unitLetter,
            title: action.payload.title ?? '',
            order: action.payload.order.toString(),
          },
          validationMessages: {},
          processingState: 'idle',
        },
        materialForm: {
          data: {
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            content: null,
            image: null,
            externalData: '',
            lessonMeta: {
              minutes: '0',
              chapters: '0',
              videos: '0',
              knowledgeChecks: '0',
            },
          },
          validationMessages: {},
          progress: 0,
          contentKey: state.materialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.materialForm.contentKey + 1,
          imageKey: state.materialForm.imageKey === Number.MAX_SAFE_INTEGER ? 0 : state.materialForm.imageKey + 1,
          processingState: 'idle',
        },
        error: false,
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'UNIT_LETTER_CHANGED': {
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
    case 'SAVE_UNIT_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_UNIT_SUCEEDED': {
      if (!state.unit) {
        throw Error('newMaterialUnit is undefined');
      }
      return {
        ...state,
        unit: {
          ...state.unit,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            unitLetter: action.payload.unitLetter,
            title: action.payload.title ?? '',
            order: action.payload.order.toString(),
          },
          validationMessages: {},
          processingState: 'idle',
        },
      };
    }
    case 'SAVE_UNIT_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };

    case 'DELETE_UNIT_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'DELETE_UNIT_SUCEEDED': {
      if (!state.unit) {
        throw Error('newMaterialUnit is undefined');
      }
      return {
        ...state,
        unit: undefined,
        form: {
          ...state.form,
          data: {
            unitLetter: '',
            title: '',
            order: '0',
          },
          validationMessages: {},
          processingState: 'idle',
        },
      };
    }
    case 'DELETE_UNIT_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'delete error',
          errorMessage: action.payload,
        },
      };
    case 'MATERIAL_TYPE_CHANGED': {
      if (action.payload === state.materialForm.data.type) {
        return state;
      }

      const type: MaterialType = [ 'lesson', 'video', 'download', 'assignment' ].includes(action.payload)
        ? action.payload as MaterialType
        : 'lesson';

      const contentKey = state.materialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.materialForm.contentKey + 1;

      return {
        ...state,
        materialForm: {
          ...state.materialForm,
          data: {
            ...state.materialForm.data,
            type,
            content: null,
            externalData: '',
            lessonMeta: type === 'lesson' ? {
              minutes: '0',
              chapters: '0',
              videos: '0',
              knowledgeChecks: '0',
            } : null,
          },
          validationMessages: {
            ...state.materialForm.validationMessages,
            content: undefined,
            externalData: undefined,
          },
          contentKey,
        },
      };
    }
    case 'MATERIAL_TITLE_CHANGED': {
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
        materialForm: {
          ...state.materialForm,
          data: { ...state.materialForm.data, title: action.payload },
          validationMessages: { ...state.materialForm.validationMessages, title: validationMessage },
        },
      };
    }
    case 'MATERIAL_DESCRIPTION_CHANGED': {
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
        materialForm: {
          ...state.materialForm,
          data: { ...state.materialForm.data, description: action.payload },
          validationMessages: { ...state.materialForm.validationMessages, description: validationMessage },
        },
      };
    }
    case 'MATERIAL_ORDER_CHANGED': {
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
        materialForm: {
          ...state.materialForm,
          data: { ...state.materialForm.data, order: action.payload },
          validationMessages: { ...state.materialForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'MATERIAL_CONTENT_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        if (state.materialForm.data.type === 'lesson') {
          const maxSize = 268_435_456; // 256 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.materialForm.data.type === 'download') {
          const maxSize = 16_777_216; // 16 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.materialForm.data.type === 'video' || state.materialForm.data.type === 'assignment') {
          throw Error(`File not allowed for type ${state.materialForm.data.type}`);
        }
      }
      return {
        ...state,
        materialForm: {
          ...state.materialForm,
          data: { ...state.materialForm.data, content: action.payload },
          validationMessages: { ...state.materialForm.validationMessages, content: validationMessage },
        },
      };
    }
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
        materialForm: {
          ...state.materialForm,
          data: { ...state.materialForm.data, image: action.payload },
          validationMessages: { ...state.materialForm.validationMessages, image: validationMessage },
        },
      };
    }
    case 'MATERIAL_EXTERNAL_DATA_CHANGED': {
      let validationMessage: string | undefined;
      if (state.materialForm.data.type === 'video') {
        const maxLength = 1024;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      } else {
        throw Error(`External data not allowed for type ${state.materialForm.data.type}`);
      }
      return {
        ...state,
        materialForm: {
          ...state.materialForm,
          data: {
            ...state.materialForm.data,
            externalData: action.payload,
          },
          validationMessages: {
            ...state.materialForm.validationMessages,
            externalData: validationMessage,
          },
        },
      };
    }
    case 'MATERIAL_MINUTES_CHANGED':
      return updateLessonMeta(state, 'minutes', action.payload);
    case 'MATERIAL_CHAPTERS_CHANGED':
      return updateLessonMeta(state, 'chapters', action.payload);
    case 'MATERIAL_VIDEOS_CHANGED':
      return updateLessonMeta(state, 'videos', action.payload);
    case 'MATERIAL_KNOWLEDGE_CHECKS_CHANGED':
      return updateLessonMeta(state, 'knowledgeChecks', action.payload);
    case 'ADD_MATERIAL_STARTED':
      return {
        ...state,
        materialForm: { ...state.materialForm, progress: 0, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_MATERIAL_PROGRESSED':
      return {
        ...state,
        materialForm: { ...state.materialForm, progress: action.payload },
      };
    case 'ADD_MATERIAL_SUCCEEDED': {
      if (!state.unit) {
        throw Error('unit is undefined');
      }
      const materials = [ ...state.unit.materials, action.payload ].sort((a, b) => a.order - b.order);
      return {
        ...state,
        unit: {
          ...state.unit,
          materials,
        },
        materialForm: {
          ...state.materialForm,
          data: {
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            content: null,
            image: null,
            externalData: '',
            lessonMeta: {
              minutes: '0',
              chapters: '0',
              videos: '0',
              knowledgeChecks: '0',
            },
          },
          validationMessages: {},
          progress: 0,
          contentKey: state.materialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.materialForm.contentKey + 1,
          imageKey: state.materialForm.imageKey === Number.MAX_SAFE_INTEGER ? 0 : state.materialForm.imageKey + 1,
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_MATERIAL_FAILED':
      return {
        ...state,
        materialForm: { ...state.materialForm, progress: 0, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};

const updateLessonMeta = (state: State, key: keyof LessonMeta, value: string): State => {
  if (!state.materialForm.data.lessonMeta) {
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
    materialForm: {
      ...state.materialForm,
      data: {
        ...state.materialForm.data,
        lessonMeta: {
          ...state.materialForm.data.lessonMeta,
          [key]: value,
        },
      },
      validationMessages: {
        ...state.materialForm.validationMessages,
        [key]: validationMessage,
      },
    },
  };
};
