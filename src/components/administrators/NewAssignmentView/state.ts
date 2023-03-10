import type { NewAssignment } from '@/domain/administrator/newAssignment';
import type { NewPart } from '@/domain/administrator/newPart';
import type { NewSubmission } from '@/domain/administrator/newSubmission';
import type { NewTextBox } from '@/domain/administrator/newTextBox';
import type { NewUploadSlot } from '@/domain/administrator/newUploadSlot';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { NewAssignmentWithChildren } from '@/services/administrators/newAssignmentService';

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
    newSubmission: Omit<NewSubmission, 'complete' | 'points' | 'mark' | 'markOverride'>;
    newParts: PartWithForms[];
    newAssignmentMedia: NewAssignmentMedium[];
  };
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: NewAssignmentWithChildren }
  | { type: 'LOAD_DATA_FAILED'; payload?: number }
  | { type: 'SAVE_TEXT_BOX_STARTED'; payload: { partId: string; textBoxId: string } }
  | { type: 'SAVE_TEXT_BOX_SUCCEEDED'; payload: { partId: string; textBoxId: string; markOverride: number | null } }
  | { type: 'SAVE_TEXT_BOX_FAILED'; payload: { partId: string; textBoxId: string; message?: string } }
  | { type: 'SAVE_UPLOAD_SLOT_STARTED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'SAVE_UPLOAD_SLOT_SUCCEEDED'; payload: { partId: string; uploadSlotId: string; markOverride: number | null } }
  | { type: 'SAVE_UPLOAD_SLOT_FAILED'; payload: { partId: string; uploadSlotId: string; message?: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        newAssignment: {
          ...action.payload,
          newParts: action.payload.newParts.map(p => ({
            ...p,
            newTextBoxes: p.newTextBoxes.map(t => ({
              ...t,
              form: { state: 'idle' },
            })),
            newUploadSlots: p.newUploadSlots.map(u => ({
              ...u,
              form: { state: 'idle' },
            })),
          })),
        },
        error: false,
        errorCode: undefined,
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, newAssignment: undefined, error: true, errorCode: action.payload };
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
      let assignmentMarkOverride = 0;
      let assignmentOverridden = false;
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              if (p.markOverride) {
                assignmentOverridden = true;
              }
              assignmentMarkOverride += p.markOverride ?? p.mark ?? 0;
              return p;
            }
            let partMarkOverride = 0;
            let partOverridden = false;
            const part: PartWithForms = {
              ...p,
              newTextBoxes: p.newTextBoxes.map(t => {
                if (t.textBoxId !== action.payload.textBoxId) {
                  if (t.markOverride) {
                    partOverridden = true;
                  }
                  partMarkOverride += t.markOverride ?? t.mark ?? 0;
                  return t;
                }
                if (action.payload.markOverride !== null) {
                  partOverridden = true;
                }
                partMarkOverride += action.payload.markOverride ?? t.mark ?? 0;
                return {
                  ...t,
                  markOverride: action.payload.markOverride,
                  form: { ...t.form, state: 'idle' },
                };
              }),
              newUploadSlots: p.newUploadSlots.map(u => {
                if (u.markOverride) {
                  partOverridden = true;
                }
                partMarkOverride += u.markOverride ?? u.mark ?? 0;
                return u;
              }),
              markOverride: partOverridden ? partMarkOverride : null,
            };
            if (partOverridden) {
              assignmentOverridden = true;
            }
            assignmentMarkOverride += partMarkOverride ?? part.mark ?? 0;
            return part;
          }),
          markOverride: assignmentOverridden ? assignmentMarkOverride : null,
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
    case 'SAVE_UPLOAD_SLOT_SUCCEEDED': {
      if (typeof state.newAssignment === 'undefined') {
        throw Error('newAssignment is undefined');
      }
      let assignmentMarkOverride = 0;
      let assignmentOverridden = false;
      return {
        ...state,
        newAssignment: {
          ...state.newAssignment,
          newParts: state.newAssignment.newParts.map(p => {
            if (p.partId !== action.payload.partId) {
              if (p.markOverride) {
                assignmentOverridden = true;
              }
              assignmentMarkOverride += p.markOverride ?? p.mark ?? 0;
              return p;
            }
            let partMarkOverride = 0;
            let partOverridden = false;
            const part: PartWithForms = {
              ...p,
              newTextBoxes: p.newTextBoxes.map(t => {
                if (t.markOverride) {
                  partOverridden = true;
                }
                partMarkOverride += t.markOverride ?? t.mark ?? 0;
                return t;
              }),
              newUploadSlots: p.newUploadSlots.map(u => {
                if (u.uploadSlotId !== action.payload.uploadSlotId) {
                  if (u.markOverride) {
                    partOverridden = true;
                  }
                  partMarkOverride += u.markOverride ?? u.mark ?? 0;
                  return u;
                }
                if (action.payload.markOverride !== null) {
                  partOverridden = true;
                }
                partMarkOverride += action.payload.markOverride ?? u.mark ?? 0;
                return {
                  ...u,
                  markOverride: action.payload.markOverride,
                  form: { ...u.form, state: 'idle' },
                };
              }),
              markOverride: partOverridden ? partMarkOverride : null,
            };
            if (partOverridden) {
              assignmentOverridden = true;
            }
            assignmentMarkOverride += partMarkOverride ?? part.mark ?? 0;
            return part;
          }),
          markOverride: assignmentOverridden ? assignmentMarkOverride : null,
        },
      };
    }
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

export const initialState: State = {
  error: false,
};
