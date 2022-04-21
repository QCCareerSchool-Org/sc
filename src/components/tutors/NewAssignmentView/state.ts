import type { Enrollment } from '@/domain/enrollment';
import type { NewAssignment } from '@/domain/newAssignment';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPart } from '@/domain/newPart';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewTextBox } from '@/domain/newTextBox';
import type { NewUnit } from '@/domain/newUnit';
import type { NewUploadSlot } from '@/domain/newUploadSlot';
import type { NewAssignmentWithUnitAndChildren } from '@/services/tutors/newAssignmentService';

/**
 * For keeping track of the form state
 *
 * Form values and validation messages are stored lower down in the tree,
 * inside child components
 */
export type InputForm = {
  state: 'idle' | 'saving' | 'save error';
  errorMessage?: string;
};

export type WithInputForm<Input> = Input & {
  form: InputForm;
};

export type PartWithForms = NewPart & {
  newTextBoxes: WithInputForm<NewTextBox>[];
  newUploadSlots: WithInputForm<NewUploadSlot>[];
  newPartMedia: NewPartMedium[];
};

export type State = {
  newAssignment?: NewAssignment & {
    newUnit: Omit<NewUnit, 'complete' | 'points' | 'mark'> & {
      enrollment: Enrollment;
    };
    newParts: PartWithForms[];
    newAssignmentMedia: NewAssignmentMedium[];
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_ASSIGNMENT_SUCCEEDED'; payload: NewAssignmentWithUnitAndChildren }
  | { type: 'LOAD_ASSIGNMENT_FAILED'; payload?: number }
  | { type: 'SAVE_TEXT_BOX_STARTED'; payload: { partId: string; textBoxId: string } }
  | { type: 'SAVE_TEXT_BOX_SUCCEEDED'; payload: { partId: string; textBoxId: string; mark: number | null; notes: string | null } }
  | { type: 'SAVE_TEXT_BOX_FAILED'; payload: { partId: string; textBoxId: string; message?: string } }
  | { type: 'SAVE_UPLOAD_SLOT_STARTED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'SAVE_UPLOAD_SLOT_SUCCEEDED'; payload: { partId: string; uploadSlotId: string; mark: number | null; notes: string | null } }
  | { type: 'SAVE_UPLOAD_SLOT_FAILED'; payload: { partId: string; uploadSlotId: string; message?: string } };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ASSIGNMENT_SUCCEEDED': {
      return {
        ...state,
        newAssignment: {
          ...action.payload,
          newParts: action.payload.newParts.filter(p => p.complete).map(p => ({
            ...p,
            newTextBoxes: p.newTextBoxes.filter(t => t.complete).map(t => ({
              ...t,
              form: { state: 'idle' },
            })),
            newUploadSlots: p.newUploadSlots.filter(u => u.complete).map(u => ({
              ...u,
              form: { state: 'idle' },
            })),
          })),
        },
        error: false,
        errorCode: undefined,
      };
    }
    case 'LOAD_ASSIGNMENT_FAILED': {
      return { ...state, newAssignment: undefined, error: true, errorCode: action.payload };
    }
    case 'SAVE_TEXT_BOX_STARTED':
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              return p;
            }
            return {
              ...p,
              newTextBoxes: p.newTextBoxes.map(t => {
                if (t.textBoxId !== action.payload.textBoxId) {
                  return t;
                }
                return { ...t, form: { ...t.form, state: 'saving', errorMessage: undefined } };
              }),
            };
          }),
        },
      };
    case 'SAVE_TEXT_BOX_SUCCEEDED': {
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      let assignmentMarked = true;
      let assignmentMark = 0;
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              if (p.mark === null) {
                assignmentMarked = false;
              }
              assignmentMark += p.mark ?? 0;
              return p;
            }
            let partMarked = true;
            let partMark = 0;
            const part: PartWithForms = {
              ...p,
              newTextBoxes: p.newTextBoxes.map(t => {
                if (t.textBoxId !== action.payload.textBoxId) {
                  if (t.mark === null && t.points > 0) {
                    partMarked = false;
                  }
                  partMark += t.mark ?? 0;
                  return t;
                }
                if (action.payload.mark === null && t.points > 0) {
                  partMarked = false;
                }
                partMark += action.payload.mark ?? 0;
                return {
                  ...t,
                  mark: action.payload.mark,
                  notes: action.payload.notes,
                  form: { ...t.form, state: 'idle' },
                };
              }),
              mark: partMarked ? partMark : null,
            };
            assignmentMark += partMark;
            return part;
          }),
          mark: assignmentMarked ? assignmentMark : null,
        },
      };
    }
    case 'SAVE_TEXT_BOX_FAILED':
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              return p;
            }
            return {
              ...p,
              newTextBoxes: p.newTextBoxes.map(t => {
                if (t.textBoxId !== action.payload.textBoxId) {
                  return t;
                }
                return {
                  ...t,
                  form: { ...t.form, state: 'save error', errorMessage: action.payload.message },
                };
              }),
            };
          }),
        },
      };
    case 'SAVE_UPLOAD_SLOT_STARTED':
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              return p;
            }
            return {
              ...p,
              newUploadSlots: p.newUploadSlots.map(u => {
                if (u.uploadSlotId !== action.payload.uploadSlotId) {
                  return u;
                }
                return {
                  ...u,
                  form: { ...u.form, state: 'saving', errorMessage: undefined },
                };
              }),
            };
          }),
        },
      };
    case 'SAVE_UPLOAD_SLOT_SUCCEEDED':
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              return p;
            }
            return {
              ...p,
              newUploadSlots: p.newUploadSlots.map(u => {
                if (u.uploadSlotId !== action.payload.uploadSlotId) {
                  return u;
                }
                return {
                  ...u,
                  mark: action.payload.mark,
                  notes: action.payload.notes,
                  form: { ...u.form, state: 'idle' },
                };
              }),
            };
          }),
        },
      };
    case 'SAVE_UPLOAD_SLOT_FAILED':
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              return p;
            }
            return {
              ...p,
              newUploadSlots: p.newUploadSlots.map(u => {
                if (u.uploadSlotId !== action.payload.uploadSlotId) {
                  return u;
                }
                return {
                  ...u,
                  form: { ...u.form, state: 'save error', errorMessage: action.payload.message },
                };
              }),
            };
          }),
        },
      };
  }
};
