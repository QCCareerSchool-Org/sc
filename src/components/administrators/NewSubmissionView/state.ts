import type { NewSubmission } from '@/domain/administrator/newSubmission';
import type { Tutor } from '@/domain/administrator/tutor';
import type { NewSubmissionWithEnrollmentAndCourseAndAssignments, NewTransferWithSubmissionAndTutors } from '@/services/administrators/newSubmissionService';

interface Data {
  newSubmission: NewSubmissionWithEnrollmentAndCourseAndAssignments;
  // student: StudentWithCountryAndProvince;
  tutors: Tutor[];
}

export interface State {
  data?: Data;
  transferForm: {
    data: {
      tutorId: number | null;
    };
    validationMessages: {
      tutorId?: string;
    };
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  restartForm: {
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  adminNoteForm: {
    processingState: 'idle' | 'saving' | 'save error';
    errorMessage?: string;
  };
  popup: boolean;
  error: boolean;
  errorCode?: number;
}

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: Data }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'TUTOR_ID_CHANGED'; payload: number | null }
  | { type: 'ADMIN_NOTE_CHANGED'; payload: string }
  | { type: 'ADMIN_NOTE_SAVE_STARTED' }
  | { type: 'ADMIN_NOTE_SAVE_SUCCEEDED' }
  | { type: 'ADMIN_NOTE_SAVE_FAILED'; payload: string }
  | { type: 'POPUP_TOGGLED' }
  | { type: 'SUBMISSION_TRANSFER_STARTED' }
  | { type: 'SUBMISSION_TRANSFER_SUCCEEDED'; payload: NewTransferWithSubmissionAndTutors }
  | { type: 'SUBMISSION_TRANSFER_FAILED'; payload?: string }
  | { type: 'SUBMISSION_RESTART_STARTED' }
  | { type: 'SUBMISSION_RESTART_SUCCEEDED'; payload: NewSubmission }
  | { type: 'SUBMISSION_RESTART_FAILED'; payload?: string };

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
        transferForm: {
          ...state.transferForm,
          data: { ...state.transferForm.data, tutorId: action.payload },
          validationMessages: { ...state.transferForm.validationMessages, tutorId: validationMessage },
        },
      };
    }
    case 'ADMIN_NOTE_CHANGED':
      if (!state.data) {
        throw Error('Data isn\'t loaded');
      }
      return {
        ...state,
        data: {
          ...state.data,
          newSubmission: {
            ...state.data.newSubmission,
            enrollment: {
              ...state.data.newSubmission.enrollment,
              student: {
                ...state.data.newSubmission.enrollment.student,
                adminNote: action.payload,
              },
            },
          },
        },
        adminNoteForm: { processingState: 'idle', errorMessage: undefined },
      };
    case 'ADMIN_NOTE_SAVE_STARTED':
      return { ...state, adminNoteForm: { processingState: 'saving', errorMessage: undefined } };
    case 'ADMIN_NOTE_SAVE_SUCCEEDED':
      return { ...state, adminNoteForm: { processingState: 'idle', errorMessage: undefined } };
    case 'ADMIN_NOTE_SAVE_FAILED':
      return { ...state, adminNoteForm: { processingState: 'save error', errorMessage: action.payload } };
    case 'SUBMISSION_TRANSFER_STARTED':
      return { ...state, transferForm: { ...state.transferForm, processingState: 'saving', errorMessage: undefined } };
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
            ...action.payload.newSubmission,
            newTransfers: [ ...state.data.newSubmission.newTransfers, action.payload ],
          },
        },
        transferForm: {
          ...state.transferForm,
          processingState: 'idle',
        },
        popup: false, // close the popup
      };
    case 'SUBMISSION_TRANSFER_FAILED':
      return { ...state, transferForm: { ...state.transferForm, processingState: 'save error', errorMessage: action.payload } };
    case 'SUBMISSION_RESTART_STARTED':
      return { ...state, restartForm: { ...state.restartForm, processingState: 'saving', errorMessage: undefined } };
    case 'SUBMISSION_RESTART_SUCCEEDED':
      if (!state.data) {
        throw Error('Data isn\'t loaded');
      }
      return { ...state, data: { ...state.data, newSubmission: { ...state.data.newSubmission, redoId: action.payload.submissionId } }, restartForm: { ...state.restartForm, processingState: 'idle' } };
    case 'SUBMISSION_RESTART_FAILED':
      return { ...state, restartForm: { ...state.restartForm, processingState: 'save error', errorMessage: action.payload } };
  }
};

export const initialState: State = {
  error: false,
  transferForm: {
    data: { tutorId: null },
    validationMessages: {},
    processingState: 'idle',
  },
  restartForm: {
    processingState: 'idle',
  },
  adminNoteForm: {
    processingState: 'idle',
  },
  popup: false,
};
