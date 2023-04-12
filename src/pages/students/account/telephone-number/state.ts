import type { CRMTelephoneCountryCode } from '@/domain/crm/crmTelephoneCountryCode';
import type { CRMStudent } from '@/domain/student/crm/crmStudent';
import type { CRMStudentWithCountryProvinceAndEnrollments } from '@/services/students/crmStudentService';

export type State = {
  crmStudent?: CRMStudentWithCountryProvinceAndEnrollments;
  crmTelephoneCountryCodes?: CRMTelephoneCountryCode[];
  form: {
    data: {
      telephoneCountryCodeId: string;
      telephoneNumber: string;
    };
    telephoneCountryCode: number;
    processingState: 'idle' | 'saving' | 'save error' | 'success';
    errorMessage?: string;
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: { crmStudent: CRMStudentWithCountryProvinceAndEnrollments; crmTelephoneCountryCodes: CRMTelephoneCountryCode[] } }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'TELEPHONE_COUNTY_CODE_ID_UPDATED'; payload: string }
  | { type: 'TELEPHONE_NUMBER_UPDATED'; payload: string }
  | { type: 'UPDATE_TELEPHONE_NUMBER_STARTED' }
  | { type: 'UPDATE_TELEPHONE_NUMBER_SUCEEDED'; payload: CRMStudent }
  | { type: 'UPDATE_TELEPHONE_NUMBER_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED': {
      const telephoneCountryCode = action.payload.crmTelephoneCountryCodes.find(t => t.code === action.payload.crmStudent.telephoneCountryCode);
      if (!telephoneCountryCode) {
        return {
          ...state,
          error: true,
        };
      }
      return {
        ...initialState,
        crmStudent: action.payload.crmStudent,
        crmTelephoneCountryCodes: action.payload.crmTelephoneCountryCodes,
        form: {
          ...state.form,
          data: {
            telephoneCountryCodeId: telephoneCountryCode.telephoneCountryCodeId.toString(),
            telephoneNumber: action.payload.crmStudent.telephoneNumber,
          },
          telephoneCountryCode: telephoneCountryCode.code,
        },
      };
    }
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TELEPHONE_COUNTY_CODE_ID_UPDATED': {
      if (!state.crmTelephoneCountryCodes) {
        throw Error('crmTelephoneCountryCodes is undefined');
      }
      const telephoneCountryCode = state.crmTelephoneCountryCodes.find(t => t.telephoneCountryCodeId === parseInt(action.payload, 10));
      if (!telephoneCountryCode) {
        throw Error('telephoneCountryCode not found');
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            telephoneCountryCodeId: telephoneCountryCode.telephoneCountryCodeId.toString(),
          },
          telephoneCountryCode: telephoneCountryCode.code,
        },
      };
    }
    case 'TELEPHONE_NUMBER_UPDATED': {
      const telephoneNumber = action.payload.replace(/[^0-9-]/ug, '').replace(/--/ug, '-');
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, telephoneNumber },
        },
      };
    }
    case 'UPDATE_TELEPHONE_NUMBER_STARTED':
      return {
        ...state,
        form: {
          ...state.form,
          processingState: 'saving',
          errorMessage: undefined,
        },
      };
    case 'UPDATE_TELEPHONE_NUMBER_SUCEEDED': {
      if (typeof state.crmStudent === 'undefined') {
        throw Error('crmStudent is undefined');
      }
      return {
        ...state,
        crmStudent: {
          ...state.crmStudent,
          ...action.payload,
        },
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            telephoneNumber: action.payload.telephoneNumber,
          },
          processingState: 'success',
        },
      };
    }
    case 'UPDATE_TELEPHONE_NUMBER_FAILED':
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
  error: false,
  form: {
    data: {
      telephoneCountryCodeId: '',
      telephoneNumber: '',
    },
    telephoneCountryCode: 0,
    processingState: 'idle',
  },
};
