import type { NewMaterial, NewMaterialType } from '@/domain/newMaterial';
import type { NewMaterialUnit } from '@/domain/newMaterialUnit';

type NewMaterialUnitWithMaterials = NewMaterialUnit & {
  newMaterials: NewMaterial[];
};

export type State = {
  newMaterialUnit?: NewMaterialUnitWithMaterials;
  form: {
    data: {
      type: NewMaterialType;
      title: string;
      description: string;
      order: string;
      file: File | null;
      externalData: string;
    };
    validationMessages: {
      type?: string;
      title?: string;
      description?: string;
      order?: string;
      file?: string;
      externalData?: string;
    };
    processingState: 'idle' | 'inserting' | 'insert error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: NewMaterialUnitWithMaterials }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }

  | { type: 'MATERIAL_TYPE_CHANGED'; payload: string }
  | { type: 'MATERIAL_TITLE_CHANGED'; payload: string }
  | { type: 'MATERIAL_DESCRIPTION_CHANGED'; payload: string }
  | { type: 'MATERIAL_ORDER_CHANGED'; payload: string }
  | { type: 'MATERIAL_FILE_CHANGED'; payload: File | null }
  | { type: 'ADD_MATERIAL_STARTED' }
  | { type: 'ADD_MATERIAL_SUCCEEDED'; payload: NewMaterial }
  | { type: 'ADD_MATERIAL_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: {
      type: 'lesson',
      title: '',
      description: '',
      order: '0',
      file: null,
      externalData: '',
    },
    validationMessages: {},
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
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            file: null,
            externalData: '',
          },
          validationMessages: {},
          processingState: 'idle',
        },
        error: false,
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'MATERIAL_TYPE_CHANGED': {
      const type = ([ 'lesson', 'video', 'download', 'assignment' ].includes(action.payload)
        ? action.payload
        : 'lesson') as NewMaterialType;
      const [ file, fileValidationMessage ] = type === state.form.data.type
        ? [ state.form.data.file, state.form.validationMessages.file ] // keep existing file and validation message, if any
        : [ null, undefined ]; // set file to null and validation message to undefined
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, type, file },
          validationMessages: { ...state.form.validationMessages, file: fileValidationMessage },
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
        form: {
          ...state.form,
          data: { ...state.form.data, title: action.payload },
          validationMessages: { ...state.form.validationMessages, title: validationMessage },
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
        form: {
          ...state.form,
          data: { ...state.form.data, description: action.payload },
          validationMessages: { ...state.form.validationMessages, description: validationMessage },
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
        form: {
          ...state.form,
          data: { ...state.form.data, order: action.payload },
          validationMessages: { ...state.form.validationMessages, order: validationMessage },
        },
      };
    }
    case 'MATERIAL_FILE_CHANGED': {
      let validationMessage: string | undefined;
      if (action.payload) {
        if (state.form.data.type === 'lesson') {
          const maxSize = 33554432;
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.form.data.type === 'download') {
          const maxSize = 16777216;
          if (action.payload.size > maxSize) {
            validationMessage = 'File exceeds maximum size';
          }
        } else if (state.form.data.type === 'video' || state.form.data.type === 'assignment') {
          throw Error(`File not allowed for type ${state.form.data.type}`);
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, file: action.payload },
          validationMessages: { ...state.form.validationMessages, file: validationMessage },
        },
      };
    }
    case 'ADD_MATERIAL_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'inserting', errorMessage: undefined },
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
        form: {
          ...state.form,
          data: {
            type: 'lesson',
            title: '',
            description: '',
            order: '0',
            file: null,
            externalData: '',
          },
          validationMessages: {},
          processingState: 'idle',
          errorMessage: undefined,
        },
      };
    }
    case 'ADD_MATERIAL_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'insert error', errorMessage: action.payload },
      };
  }
};
