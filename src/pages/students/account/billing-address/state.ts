import type { CRMCountry } from '@/domain/crm/crmCountry';
import type { CRMProvince } from '@/domain/crm/crmProvince';
import type { CRMStudentWithCountryAndProvince, CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';

export type State = {
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
  crmCountries?: CRMCountry[];
  crmProvinces: Record<string, CRMProvince[]>;
  needsPostalCode: boolean;
  form: {
    data: {
      address1: string;
      address2: string;
      city: string;
      provinceCode: string;
      postalCode: string;
      countryCode: string;
    };
    validationMessages: {
      address1?: string;
      address2?: string;
      city?: string;
      provinceCode?: string;
      postalCode?: string;
      countryCode?: string;
    };
    processingState: 'idle' | 'saving' | 'save error' | 'success';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { crmStudent: CRMStudentWithCountryProvinceAndEnrollments; crmCountries: CRMCountry[]; crmProvinces: CRMProvince[] } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'ADDRESS1_UPDATED'; payload: string }
  | { type: 'ADDRESS2_UPDATED'; payload: string }
  | { type: 'CITY_UPDATED'; payload: string }
  | { type: 'PROVINCE_CODE_UPDATED'; payload: string }
  | { type: 'POSTAL_CODE_UPDATED'; payload: string }
  | { type: 'COUNTRY_CODE_UPDATED'; payload: { countryCode: string; crmProvinces: CRMProvince[] } }
  | { type: 'UPDATE_BILLING_ADDRESS_STARTED' }
  | { type: 'UPDATE_BILLING_ADDRESS_SUCEEDED'; payload: CRMStudentWithCountryAndProvince }
  | { type: 'UPDATE_BILLING_ADDRESS_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...initialState,
        crmStudent: action.payload.crmStudent,
        crmCountries: action.payload.crmCountries,
        crmProvinces: {
          ...state.crmProvinces,
          [action.payload.crmStudent.country.code]: action.payload.crmProvinces,
        },
        needsPostalCode: action.payload.crmStudent.country.needsPostalCode,
        form: {
          ...state.form,
          data: {
            address1: action.payload.crmStudent.address1,
            address2: action.payload.crmStudent.address2,
            city: action.payload.crmStudent.city,
            provinceCode: action.payload.crmStudent.province?.code ?? '',
            postalCode: action.payload.crmStudent.postalCode ?? '',
            countryCode: action.payload.crmStudent.country.code,
          },
        },
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'ADDRESS1_UPDATED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = `Required`;
      } else {
        const maxLength = 40;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, address1: action.payload },
          validationMessages: { ...state.form.validationMessages, address1: validationMessage },
        },
      };
    }
    case 'ADDRESS2_UPDATED': {
      let validationMessage: string | undefined;
      const maxLength = 40;
      const newLength = [ ...action.payload ].length;
      if (newLength > maxLength) {
        validationMessage = `Exceeds maximum length of ${maxLength}`;
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, address2: action.payload },
          validationMessages: { ...state.form.validationMessages, address2: validationMessage },
        },
      };
    }
    case 'CITY_UPDATED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = `Required`;
      } else {
        const maxLength = 31;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, city: action.payload },
          validationMessages: { ...state.form.validationMessages, city: validationMessage },
        },
      };
    }
    case 'PROVINCE_CODE_UPDATED': {
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, provinceCode: action.payload },
        },
      };
    }
    case 'POSTAL_CODE_UPDATED': {
      let validationMessage: string | undefined;
      if (action.payload.length === 0) {
        validationMessage = `Required`;
      } else {
        const maxLength = 10;
        const newLength = [ ...action.payload ].length;
        if (newLength > maxLength) {
          validationMessage = `Exceeds maximum length of ${maxLength}`;
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, postalCode: action.payload },
          validationMessages: { ...state.form.validationMessages, postalCode: validationMessage },
        },
      };
    }
    case 'COUNTRY_CODE_UPDATED': {
      if (typeof state.crmCountries === 'undefined') {
        throw Error('crmCountries is undefined');
      }
      const country = state.crmCountries.find(c => c.code === action.payload.countryCode);
      if (!country) {
        throw Error('country not found');
      }
      return {
        ...state,
        crmProvinces: {
          ...state.crmProvinces,
          [action.payload.countryCode]: action.payload.crmProvinces,
        },
        needsPostalCode: country.needsPostalCode,
        form: {
          ...state.form,
          data: { ...state.form.data, countryCode: action.payload.countryCode, provinceCode: action.payload.crmProvinces.length ? action.payload.crmProvinces[0].code : '' },
        },
      };
    }
    case 'UPDATE_BILLING_ADDRESS_STARTED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'saving',
          errorMessage: undefined,
        },
      };
    case 'UPDATE_BILLING_ADDRESS_SUCEEDED': {
      if (typeof state.crmStudent === 'undefined') {
        throw Error('crmStudent is undefined');
      }
      return {
        ...state,
        crmStudent: { ...state.crmStudent, ...action.payload },
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            address1: action.payload.address1,
            address2: action.payload.address2,
            city: action.payload.city,
            provinceCode: action.payload.province?.code ?? '',
            postalCode: action.payload.postalCode ?? '',
            countryCode: action.payload.country.code,
          },
          processingState: 'success',
        },
      };
    }
    case 'UPDATE_BILLING_ADDRESS_FAILED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'save error',
          errorMessage: action.payload,
        },
      };
  }
};

export const initialState: State = {
  crmProvinces: {},
  needsPostalCode: false,
  form: {
    data: {
      address1: '',
      address2: '',
      city: '',
      provinceCode: '',
      postalCode: '',
      countryCode: '',
    },
    validationMessages: {},
    processingState: 'idle',
  },
  error: false,
};
