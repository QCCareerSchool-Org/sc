import type { NewMaterial } from '@/domain/newMaterial';

export type State = {
  newMaterial?: NewMaterial;
  form: {
    data: {
      title: string;
      description: string;
      order: string;
    };
    validationMessages: {
      title?: string;
      description?: string;
      order?: string;
    };
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_MATERIAL_SUCCEEDED'; payload: NewMaterial }
  | { type: 'LOAD_MATERIAL_FAILED'; payload?: number }
  | { type: 'TITLE_CHANGED'; payload: string }
  | { type: 'DESCRIPTION_CHANGED'; payload: string }
  | { type: 'ORDER_CHANGED'; payload: string }
  | { type: 'SAVE_MATERIAL_STARTED' }
  | { type: 'SAVE_MATERIAL_SUCCEEDED'; payload: NewMaterial }
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
        newMaterial: action.payload,
        form: {
          data: {
            title: action.payload.title,
            description: action.payload.description,
            order: action.payload.order.toString(),
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
    case 'SAVE_MATERIAL_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'SAVE_MATERIAL_SUCCEEDED': {
      if (!state.newMaterial) {
        throw Error('newMaterial is undefined');
      }
      return {
        ...state,
        newMaterial: {
          ...state.newMaterial,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            title: action.payload.title ?? '',
            description: action.payload.description ?? '',
            order: action.payload.order.toString(),
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
      if (!state.newMaterial) {
        throw Error('newMaterial is undefined');
      }
      return {
        ...state,
        newMaterial: undefined,
        form: {
          ...state.form,
          data: {
            title: '',
            description: '',
            order: '0',
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
