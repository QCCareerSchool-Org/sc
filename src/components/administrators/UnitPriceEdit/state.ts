import type { Country } from '@/domain/country';
import type { Currency } from '@/domain/currency';
import type { CourseWithSchoolAndSubmissionTemplatesAndPrices } from '@/services/administrators/courseService';

type FormData = Array<{
  submissionTemplateId: string;
  unitLetter: string;
  price: string;
  currencyId: string;
}>;

export type State = {
  currencies?: Currency[];
  course?: CourseWithSchoolAndSubmissionTemplatesAndPrices;
  country?: Country | null;
  form: {
    data: FormData;
    processingState: 'idle' | 'saving' | 'deleting' | 'save error' | 'delete error';
    errorMessage?: string;
  };
  processingState: 'initial' | 'idle' | 'loading' | 'load error';
  errorCode?: number;
  inconsistentCurrencies: boolean;
  nonStandardCurrencies: boolean;
};

export type Action =
  | { type: 'LOAD_DATA_STARTED' }
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { currencies: Currency[]; course: CourseWithSchoolAndSubmissionTemplatesAndPrices; country: Country | null; formData: FormData } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'PRICE_CHANGED'; payload: { unitTemplateId: string; price: string } }
  | { type: 'PRICE_BLURRED'; payload: string }
  | { type: 'CURRENCY_CHANGED'; payload: { unitTemplateId: string; currencyId: string } }
  | { type: 'UNIT_PRICES_SAVE_STARTED' }
  | { type: 'UNIT_PRICES_SAVE_SUCCEEDED' }
  | { type: 'UNIT_PRICES_SAVE_FAILED'; payload?: string }
  | { type: 'UNIT_PRICES_DELETE_STARTED' }
  | { type: 'UNIT_PRICES_DELETE_SUCCEEDED' }
  | { type: 'UNIT_PRICES_DELETE_FAILED'; payload?: string };

export const initialState: State = {
  form: {
    data: [],
    processingState: 'idle',
  },
  processingState: 'initial',
  inconsistentCurrencies: false,
  nonStandardCurrencies: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_STARTED':
      return { ...state, processingState: 'loading', errorCode: undefined };
    case 'LOAD_DATA_SUCCEEDED': {
      return {
        ...state,
        currencies: action.payload.currencies,
        course: action.payload.course,
        country: action.payload.country,
        form: {
          data: action.payload.formData,
          processingState: 'idle',
        },
        processingState: 'idle',
        inconsistentCurrencies: action.payload.formData.length >= 2 && action.payload.formData.some(d => d.currencyId !== action.payload.formData[0].currencyId),
        nonStandardCurrencies: nonStandardCurrencies(action.payload.formData, action.payload.currencies, action.payload.country?.code),
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, processingState: 'load error', errorCode: action.payload };
    case 'PRICE_CHANGED': {
      const formData = [ ...state.form.data ];
      const changedItem = formData.find(f => f.submissionTemplateId === action.payload.unitTemplateId);
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
      const changedItem = formData.find(f => f.submissionTemplateId === action.payload);
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
      const changedItem = formData.find(f => f.submissionTemplateId === action.payload.unitTemplateId);
      if (changedItem) {
        if (state.currencies.some(c => c.currencyId === parseInt(action.payload.currencyId, 10))) {
          changedItem.currencyId = action.payload.currencyId;
        }
      }
      return {
        ...state,
        form: { ...state.form, data: formData },
        inconsistentCurrencies: formData.length >= 2 && formData.some(d => d.currencyId !== formData[0].currencyId),
        nonStandardCurrencies: nonStandardCurrencies(formData, state.currencies, state.country?.code),
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
    case 'UNIT_PRICES_DELETE_STARTED':
      return {
        ...state,
        form: { ...state.form, processingState: 'deleting', errorMessage: undefined },
      };
    case 'UNIT_PRICES_DELETE_SUCCEEDED': {
      if (typeof state.currencies === 'undefined') {
        throw Error('currencies is undefined');
      }
      if (state.currencies.length === 0) {
        throw Error('currencies is empty');
      }
      const defaultCurrencyId = state.currencies[0].currencyId.toString();
      const formData = state.form.data.map(d => ({ ...d, price: '', currencyId: defaultCurrencyId }));
      return {
        ...state,
        form: {
          ...state.form,
          data: formData,
          processingState: 'idle',
        },
        inconsistentCurrencies: formData.length >= 2 && formData.some(d => d.currencyId !== formData[0].currencyId),
        nonStandardCurrencies: nonStandardCurrencies(formData, state.currencies, state.country?.code),
      };
    }
    case 'UNIT_PRICES_DELETE_FAILED':
      return {
        ...state,
        form: { ...state.form, processingState: 'delete error', errorMessage: action.payload },
      };
  }
};

const nonStandardCurrencies = (formData: FormData, currencies: Currency[], countryCode?: string): boolean => {
  if (countryCode === 'CA') {
    const cadCurrency = currencies.find(c => c.code === 'CAD');
    if (cadCurrency) {
      const currencyId = cadCurrency.currencyId.toString();
      return formData.some(p => p.currencyId !== currencyId);
    }
  } else if (countryCode === 'AU') {
    const audCurrency = currencies.find(c => c.code === 'AUD');
    if (audCurrency) {
      const currencyId = audCurrency.currencyId.toString();
      return formData.some(p => p.currencyId !== currencyId);
    }
  } else if (countryCode === 'GB') {
    const gbpCurrency = currencies.find(c => c.code === 'GBP');
    if (gbpCurrency) {
      const currencyId = gbpCurrency.currencyId.toString();
      return formData.some(p => p.currencyId !== currencyId);
    }
  } else {
    const usdCurrency = currencies.find(c => c.code === 'USD');
    if (usdCurrency) {
      const currencyId = usdCurrency.currencyId.toString();
      return formData.some(p => p.currencyId !== currencyId);
    }
  }
  return true;
};
