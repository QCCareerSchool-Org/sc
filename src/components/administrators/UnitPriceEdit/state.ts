import type { Currency } from '@/domain/currency';
import type { CourseWithSchoolAndUnitTemplatesAndPrices } from '@/services/administrators/courseService';

type FormData = {
  unitTemplateId: string;
  unitLetter: string;
  price: string;
  currencyId: string;
};

export type State = {
  currencies?: Currency[];
  course?: CourseWithSchoolAndUnitTemplatesAndPrices;
  form: {
    data: FormData[];
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  processingState: 'initial' | 'idle' | 'loading' | 'load error';
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_STARTED' }
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { currencies: Currency[]; course: CourseWithSchoolAndUnitTemplatesAndPrices; formData: FormData[] } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'PRICE_CHANGED'; payload: { unitTemplateId: string; price: string } }
  | { type: 'PRICE_BLURRED'; payload: string }
  | { type: 'CURRENCY_CHANGED'; payload: { unitTemplateId: string; currencyId: string } }
  | { type: 'UNIT_PRICES_SAVE_STARTED' }
  | { type: 'UNIT_PRICES_SAVE_SUCCEEDED' }
  | { type: 'UNIT_PRICES_SAVE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: [],
    processingState: 'idle',
  },
  processingState: 'initial',
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_STARTED':
      return { ...state, processingState: 'loading', errorCode: undefined };
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        currencies: action.payload.currencies,
        course: action.payload.course,
        form: {
          data: action.payload.formData,
          processingState: 'idle',
        },
        processingState: 'idle',
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, processingState: 'load error', errorCode: action.payload };
    case 'PRICE_CHANGED': {
      const formData = [ ...state.form.data ];
      const changedItem = formData.find(f => f.unitTemplateId === action.payload.unitTemplateId);
      if (changedItem) {
        changedItem.price = action.payload.price;
      }
      return {
        ...state,
        form: { ...state.form, data: formData },
      };
    }
    case 'PRICE_BLURRED': {
      const formData = [ ...state.form.data ];
      const changedItem = formData.find(f => f.unitTemplateId === action.payload);
      if (changedItem) {
        if (changedItem.price !== '') {
          changedItem.price = parseFloat(changedItem.price).toFixed(2);
        }
      }
      return {
        ...state,
        form: { ...state.form, data: formData },
      };
    }
    case 'CURRENCY_CHANGED': {
      if (typeof state.currencies === 'undefined') {
        throw Error('currencies is undefined');
      }
      const formData = [ ...state.form.data ];
      const changedItem = formData.find(f => f.unitTemplateId === action.payload.unitTemplateId);
      if (changedItem) {
        if (state.currencies.some(c => c.currencyId === parseInt(action.payload.currencyId, 10))) {
          changedItem.currencyId = action.payload.currencyId;
        }
      }
      return {
        ...state,
        form: { ...state.form, data: formData },
      };
    }
    case 'UNIT_PRICES_SAVE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'saving', errorMessage: undefined },
      };
    case 'UNIT_PRICES_SAVE_SUCCEEDED':
      return {
        ...state,
        form: { ...state.form, processingState: 'idle' },
      };
    case 'UNIT_PRICES_SAVE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'save error', errorMessage: action.payload },
      };
  }
};
