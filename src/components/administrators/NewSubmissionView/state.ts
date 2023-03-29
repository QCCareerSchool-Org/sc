import type { NewSubmission } from '@/domain/administrator/newSubmission';
import type { Tutor } from '@/domain/administrator/tutor';
import type { NewSubmissionWithEnrollmentAndCourseAndAssignments } from '@/services/administrators/newSubmissionService';
import type { StudentWithCountryAndProvince } from '@/services/administrators/studentService';

type Data = {
  newSubmission: NewSubmissionWithEnrollmentAndCourseAndAssignments;
  student: StudentWithCountryAndProvince;
  tutors: Tutor[];
};

export type State = {
  data?: Data;
  form: {
    data: {
      tutorId: number | null;
    };
    validationMessages: {
      tutorId?: string;
    };
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  popup: boolean;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: Data }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'TUTOR_ID_CHANGED'; payload: number | null }
  | { type: 'POPUP_TOGGLED' }
  | { type: 'SUBMISSION_TRANSFER_STARTED' }
  | { type: 'SUBMISSION_TRANSFER_SUCCEEDED'; payload: NewSubmission }
  | { type: 'SUBMISSION_TRANSFER_FAILED'; payload?: string };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return { ...state, data: action.payload, error: false, errorCode: undefined };
    case 'LOAD_DATA_FAILED':
      return { ...state, data: undefined, error: true, errorCode: action.payload };
    case 'POPUP_TOGGLED':
      return { ...state, popup: !state.popup };
    case 'TUTOR_ID_CHANGED': {
      if (!state.data) {
        throw Error('Data isn\'t loaded');
      }
      let validationMessage: string | undefined;
      if (action.payload !== null) {
        if (!state.data.tutors.find(t => t.tutorId === action.payload)) {
          validationMessage = 'Invalid tutor';
        }
      }
      return {
        ...state,
        form: {
          ...state.form,
          data: { ...state.form.data, tutorId: action.payload },
          validationMessages: { ...state.form.validationMessages, tutorId: validationMessage },
        },
      };
    }
    case 'SUBMISSION_TRANSFER_STARTED':
      return { ...state, form: { ...state.form, processingState: 'saving', errorMessage: undefined } };
    case 'SUBMISSION_TRANSFER_SUCCEEDED':
      if (!state.data) {
        throw Error('Data isn\'t loaded');
      }
      return {
        ...state,
        data: {
          ...state.data,
          newSubmission: {
            ...state.data.newSubmission,
            ...action.payload,
          },
        },
        form: {
          ...state.form,
          processingState: 'idle',
        },
      };
    case 'SUBMISSION_TRANSFER_FAILED':
      return { ...state, form: { ...state.form, processingState: 'save error', errorMessage: action.payload } };
  }
};

export const initialState: State = {
  error: false,
  form: {
    data: { tutorId: null },
    validationMessages: {},
    processingState: 'idle',
  },
  popup: false,
};
