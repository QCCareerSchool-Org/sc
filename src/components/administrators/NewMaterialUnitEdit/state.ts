import type { NewMaterial, NewMaterialType } from '@/domain/newMaterial';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type NewMaterialUnitWithMaterials = NewMaterialUnit & {
  newMaterials: NewMaterial[];
};

export type State = {
  newMaterialUnit?: NewMaterialUnitWithMaterials;
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
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  newMaterialForm: {
    data: {
      type: NewMaterialType;
      title: string;
      description: string;
      order: string;
      content: File | null;
      image: File | null;
      externalData: string;
    };
    validationMessages: {
      type?: string;
      title?: string;
      description?: string;
      order?: string;
      content?: string;
      image?: string;
      externalData?: string;
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
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: NewMaterialUnitWithMaterials }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }

  | { type: 'UNIT_LETTER_CHANGED'; payload: string }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'SAVE_MATERIAL_UNIT_STARTED' }
  | { type: 'SAVE_MATERIAL_UNIT_SUCEEDED'; payload: NewMaterialUnit }
  | { type: 'SAVE_MATERIAL_UNIT_FAILED'; payload?: string }

  | { type: 'MATERIAL_TYPE_CHANGED'; payload: string }
  | { type: 'MATERIAL_TITLE_CHANGED'; payload: string }
  | { type: 'MATERIAL_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'MATERIAL_ORDER_CHANGED'; payload: string }
  | { type: 'MATERIAL_CONTENT_CHANGED'; payload: File | null }
  | { type: 'MATERIAL_IMAGE_CHANGED'; payload: File | null }
  | { type: 'MATERIAL_EXTERNAL_DATA_CHANGED'; payload: string }
  | { type: 'ADD_MATERIAL_STARTED' }
  | { type: 'ADD_MATERIAL_PROGRESSED'; payload: number }
  | { type: 'ADD_MATERIAL_SUCCEEDED'; payload: NewMaterial }
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
  newMaterialForm: {
    data: {
      type: 'lesson',
      title: '',
      description: '',
      order: '0',
      content: null,
      image: null,
      externalData: '',
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
        newMaterialUnit: action.payload,
        form: {
          data: {
            unitLetter: action.payload.unitLetter,
            title: action.payload.title ?? '',
            order: action.payload.order.toString(),
          },
          validationMessages: {},
          processingState: 'idle',
        },
        newMaterialForm: {
          data: {
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            content: null,
            image: null,
            externalData: '',
          },
          validationMessages: {},
          progress: 0,
          contentKey: state.newMaterialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.newMaterialForm.contentKey + 1,
          imageKey: state.newMaterialForm.imageKey === Number.MAX_SAFE_INTEGER ? 0 : state.newMaterialForm.imageKey + 1,
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
    case 'SAVE_MATERIAL_UNIT_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_MATERIAL_UNIT_SUCEEDED': {
      if (!state.newMaterialUnit) {
        throw Error('newMaterialUnit is undefined');
      }
      return {
        ...state,
        newMaterialUnit: {
          ...state.newMaterialUnit,
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
    case 'SAVE_MATERIAL_UNIT_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };

    case 'MATERIAL_TYPE_CHANGED': {
      if (action.payload === state.newMaterialForm.data.type) {
        return state;
      }

      const type: NewMaterialType = [ 'lesson', 'video', 'download', 'assignment' ].includes(action.payload)
        ? action.payload as NewMaterialType
        : 'lesson';

      const contentKey = state.newMaterialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.newMaterialForm.contentKey + 1;

      return {
        ...state,
        newMaterialForm: {
          ...state.newMaterialForm,
          data: {
            ...state.newMaterialForm.data,
            type,
            content: null,
            externalData: '',
          },
          validationMessages: {
            ...state.newMaterialForm.validationMessages,
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
        newMaterialForm: {
          ...state.newMaterialForm,
          data: { ...state.newMaterialForm.data, title: action.payload },
          validationMessages: { ...state.newMaterialForm.validationMessages, title: validationMessage },
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
        newMaterialForm: {
          ...state.newMaterialForm,
          data: { ...state.newMaterialForm.data, description: action.payload },
          validationMessages: { ...state.newMaterialForm.validationMessages, description: validationMessage },
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
        newMaterialForm: {
          ...state.newMaterialForm,
          data: { ...state.newMaterialForm.data, order: action.payload },
          validationMessages: { ...state.newMaterialForm.validationMessages, order: validationMessage },
        },
      };
    }
    case 'MATERIAL_CONTENT_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        if (state.newMaterialForm.data.type === 'lesson') {
          const maxSize = 33_554_432; // 32 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.newMaterialForm.data.type === 'download') {
          const maxSize = 16_777_216; // 16 MiB
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.newMaterialForm.data.type === 'video' || state.newMaterialForm.data.type === 'assignment') {
          throw Error(`File not allowed for type ${state.newMaterialForm.data.type}`);
        }
      }
      return {
        ...state,
        newMaterialForm: {
          ...state.newMaterialForm,
          data: { ...state.newMaterialForm.data, content: action.payload },
          validationMessages: { ...state.newMaterialForm.validationMessages, content: validationMessage },
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
        newMaterialForm: {
          ...state.newMaterialForm,
          data: { ...state.newMaterialForm.data, image: action.payload },
          validationMessages: { ...state.newMaterialForm.validationMessages, image: validationMessage },
        },
      };
    }
    case 'MATERIAL_EXTERNAL_DATA_CHANGED': {
      let validationMessage: string | undefined;
      if (state.newMaterialForm.data.type === 'video') {
        const maxLength = 1024;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      } else {
        throw Error(`External data not allowed for type ${state.newMaterialForm.data.type}`);
      }
      return {
        ...state,
        newMaterialForm: {
          ...state.newMaterialForm,
          data: {
            ...state.newMaterialForm.data,
            externalData: action.payload,
          },
          validationMessages: {
            ...state.newMaterialForm.validationMessages,
            externalData: validationMessage,
          },
        },
      };
    }
    case 'ADD_MATERIAL_STARTED':
      return {
        ...state,
        newMaterialForm: { ...state.newMaterialForm, progress: 0, processingState: 'inserting', errorMessage: undefined },
      };
    case 'ADD_MATERIAL_PROGRESSED':
      return {
        ...state,
        newMaterialForm: { ...state.newMaterialForm, progress: action.payload },
      };
    case 'ADD_MATERIAL_SUCCEEDED': {
      if (!state.newMaterialUnit) {
        throw Error('newMaterialUnit is undefined');
      }
      const newMaterials = [ ...state.newMaterialUnit.newMaterials, action.payload ].sort((a, b) => a.order - b.order);
      return {
        ...state,
        newMaterialUnit: {
          ...state.newMaterialUnit,
          newMaterials,
        },
        newMaterialForm: {
          ...state.newMaterialForm,
          data: {
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            content: null,
            image: null,
            externalData: '',
          },
          validationMessages: {},
          progress: 0,
          contentKey: state.newMaterialForm.contentKey === Number.MAX_SAFE_INTEGER ? 0 : state.newMaterialForm.contentKey + 1,
          imageKey: state.newMaterialForm.imageKey === Number.MAX_SAFE_INTEGER ? 0 : state.newMaterialForm.imageKey + 1,
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_MATERIAL_FAILED':
      return {
        ...state,
        newMaterialForm: { ...state.newMaterialForm, progress: 0, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
