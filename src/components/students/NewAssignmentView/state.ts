import { NewAssignment, NewPart, NewTextBox, NewUploadSlot } from '@/domain/students';
import { NewAssignmentWithChildren } from '@/services/students';

type FormState = 'pristine' | 'dirty';

export type UploadSlotState = NewUploadSlot & {
  formState: FormState;
  saveState: 'empty' | 'saved' | 'saving' | 'save error' | 'deleting' | 'delete error';
  progress: number;
};

export type TextBoxState = NewTextBox & {
  formState: FormState;
  saveState: null | 'saving' | 'error';
  savedText: string;
};

export type PartState = NewPart & {
  formState: FormState;
  saveState: 'saved' | 'unsaved' | 'saving' | 'error';
  textBoxes: TextBoxState[];
  uploadSlots: UploadSlotState[];
};

export type AssignmentState = NewAssignment & {
  formState: FormState;
  saveState: 'saved' | 'unsaved' | 'saving' | 'error';
  parts: PartState[];
};

export type State = {
  assignment?: AssignmentState;
  error: boolean;
  errorCode?: number;
};

export const initialState: State = {
  error: false,
};

export type Action =
  | { type: 'ASSIGNMENT_LOAD_SUCCEEDED'; payload: NewAssignmentWithChildren }
  | { type: 'ASSIGNMENT_LOAD_FAILED'; payload?: number }
  | { type: 'TEXT_CHANGED'; payload: { partId: string; textBoxId: string; text: string } }
  | { type: 'TEXT_SAVE_STARTED'; payload: { partId: string; textBoxId: string } }
  | { type: 'TEXT_SAVE_SUCCEEDED'; payload: { partId: string; textBoxId: string; text: string } }
  | { type: 'TEXT_SAVE_FAILED'; payload: { partId: string; textBoxId: string } }
  | { type: 'FILE_UPLOAD_STARTED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'FILE_UPLOAD_PROGRESSED'; payload: { partId: string; uploadSlotId: string; progress: number } }
  | { type: 'FILE_UPLOAD_SUCCEEDED'; payload: { partId: string; uploadSlotId: string; filename: string; size: number } }
  | { type: 'FILE_UPLOAD_FAILED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'FILE_DELETE_STARTED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'FILE_DELETE_SUCCEEDED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'FILE_DELETE_FAILED'; payload: { partId: string; uploadSlotId: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ASSIGNMENT_LOAD_SUCCEEDED':
      return assignmentLoad(state, action.payload);
    case 'ASSIGNMENT_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'TEXT_CHANGED':
      return textChanged(state, action.payload.partId, action.payload.textBoxId, action.payload.text);
    case 'TEXT_SAVE_STARTED':
      return textSaveRequested(state, action.payload.partId, action.payload.textBoxId);
    case 'TEXT_SAVE_SUCCEEDED':
      return textSaveSucceeded(state, action.payload.partId, action.payload.textBoxId, action.payload.text);
    case 'TEXT_SAVE_FAILED':
      return textSaveFailed(state, action.payload.partId, action.payload.textBoxId);
    case 'FILE_UPLOAD_STARTED':
      return fileUploadStarted(state, action.payload.partId, action.payload.uploadSlotId);
    case 'FILE_UPLOAD_PROGRESSED':
      return fileUploadProgressed(state, action.payload.partId, action.payload.uploadSlotId, action.payload.progress);
    case 'FILE_UPLOAD_SUCCEEDED':
      return fileUploadSucceeded(state, action.payload.partId, action.payload.uploadSlotId, action.payload.filename, action.payload.size);
    case 'FILE_UPLOAD_FAILED':
      return fileUploadFailed(state, action.payload.partId, action.payload.uploadSlotId);
    case 'FILE_DELETE_STARTED':
      return fileDeleteStarted(state, action.payload.partId, action.payload.uploadSlotId);
    case 'FILE_DELETE_SUCCEEDED':
      return fileDeleteSucceeded(state, action.payload.partId, action.payload.uploadSlotId);
    case 'FILE_DELETE_FAILED':
      return fileDeleteFailed(state, action.payload.partId, action.payload.uploadSlotId);
  }
};

const assignmentLoad = (state: State, assignmentWithChildren: NewAssignmentWithChildren): State => {
  const assignment: AssignmentState = {
    ...assignmentWithChildren,
    formState: 'pristine',
    saveState: 'saved',
    parts: assignmentWithChildren.parts.map(p => ({
      ...p,
      formState: 'pristine',
      saveState: 'saved',
      textBoxes: p.textBoxes.map(t => ({
        ...t,
        formState: 'pristine',
        saveState: null,
        savedText: t.text,
      })),
      uploadSlots: p.uploadSlots.map(u => ({
        ...u,
        formState: 'pristine',
        saveState: u.complete ? 'saved' : 'empty',
        progress: u.complete ? 100 : 0,
      })),
    })),
  };
  return { ...state, assignment, error: false };
};

/**
 * Updates the text for a text box
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textChanged = (state: State, partId: string, textBoxId: string, text: string): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignment: {
      ...state.assignment,
      formState: 'dirty',
      saveState: 'unsaved',
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            formState: 'dirty',
            saveState: 'unsaved',
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return {
                  ...t,
                  text,
                  formState: 'dirty',
                  saveState: null, // will be considered unsaved because savedText won't match current value
                };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
  };
};

/**
 * Marks the assignmet, part, and text box as saving
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textSaveRequested = (state: State, partId: string, textBoxId: string): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignment: {
      ...state.assignment,
      saveState: 'saving',
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: 'saving',
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return { ...t, saveState: 'saving' };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
  };
};

/**
 * Marks a text box as saved
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textSaveSucceeded = (state: State, partId: string, textBoxId: string, text: string): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const textBox = part.textBoxes.find(t => t.textBoxId === textBoxId);
  if (!textBox) {
    throw Error('text box not found');
  }

  const textBoxComplete = text.length > 0;

  const otherTextBoxesComplete = part.textBoxes
    .filter(t => t.textBoxId !== textBoxId)
    .filter(t => !t.optional)
    .every(t => t.complete);
  const otherUploadSlotsComplete = part.uploadSlots
    .filter(u => !u.optional)
    .every(u => u.complete);
  const partComplete = (textBoxComplete || textBox.optional) && otherTextBoxesComplete && otherUploadSlotsComplete;

  const otherPartsComplete = state.assignment.parts
    .filter(p => p.partId !== partId)
    .filter(p => !p.optional)
    .every(p => p.complete);
  const assignmentComplete = (partComplete || part.optional) && otherPartsComplete;

  // for this part, check if all the other text boxes
  const partAllTextBoxesSaved = part.textBoxes
    .filter(t => t.textBoxId !== textBoxId)
    .every(t => t.formState === 'pristine' || t.savedText === t.text);
  const partAllUploadSlotsSavedOrEmpty = part.uploadSlots
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = part.textBoxes
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = part.uploadSlots
    .some(u => u.saveState === 'save error' || u.saveState === 'delete error');

  const partAnyTextBoxSaving = part.textBoxes
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignment.parts
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving
    ? 'saving'
    : assignmentAnyPartError
      ? 'error'
      : assignmentAllPartsSaved ? 'saved' : 'unsaved';

  const partSaveState = partAnyTextBoxSaving
    ? 'saving'
    : partAnyTextBoxError
      ? 'error'
      : partAllTextBoxesSaved ? 'saved' : 'unsaved';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      saveState: assignmentSaveState,
      complete: assignmentComplete,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            complete: partComplete,
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return {
                  ...t,
                  complete: textBoxComplete,
                  saveState: null, // will be considered saved because saveText matches current value
                  savedText: text,
                };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
  };
};

/**
 * Marks the assignmet, part, and text box as having a save failure
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textSaveFailed = (state: State, partId: string, textBoxId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const partAnyTextBoxSaving = part.textBoxes
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving ? 'saving' : 'error';

  const partSaveState = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting ? 'saving' : 'error';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      saveState: assignmentSaveState,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return { ...t, saveState: 'error' };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileUploadStarted = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignment: {
      ...state.assignment,
      formState: 'dirty',
      saveState: 'saving',
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            formState: 'dirty',
            saveState: 'saving',
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  formState: 'dirty',
                  saveState: 'saving',
                  progress: 0,
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileUploadProgressed = (state: State, partId: string, uploadSlotId: string, progress: number): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignment: {
      ...state.assignment,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return { ...u, progress };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileUploadSucceeded = (state: State, partId: string, uploadSlotId: string, filename: string, size: number): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const uploadSlot = part.uploadSlots.find(u => u.uploadSlotId === uploadSlotId);
  if (!uploadSlot) {
    throw Error('upload slot not found');
  }

  const uploadSlotComplete = true;

  const otherTextBoxesComplete = part.textBoxes
    .filter(t => !t.optional)
    .every(t => t.complete);
  const otherUploadSlotsComplete = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .filter(u => !u.optional)
    .every(u => u.complete);
  const partComplete = (uploadSlotComplete || uploadSlot.optional) && otherTextBoxesComplete && otherUploadSlotsComplete;

  const otherPartsComplete = state.assignment.parts
    .filter(p => p.partId !== partId)
    .filter(p => !p.optional)
    .every(p => p.complete);
  const assignmentComplete = (partComplete || part.optional) && otherPartsComplete;

  // for this part, check if all text boxes and all upload slots (other than this one) are saved
  const partAllTextBoxesSaved = part.textBoxes
    .every(t => t.formState === 'pristine' || t.savedText === t.text);
  const partAllUploadSlotsSavedOrEmpty = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = part.textBoxes
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'save error' || u.saveState === 'delete error');

  const partAnyTextBoxSaving = part.textBoxes
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignment.parts
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving
    ? 'saving'
    : assignmentAnyPartError
      ? 'error'
      : assignmentAllPartsSaved ? 'saved' : 'unsaved';

  const partSaveState = partAnyTextBoxSaving
    ? 'saving'
    : partAnyTextBoxError
      ? 'error'
      : partAllTextBoxesSaved ? 'saved' : 'unsaved';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      complete: assignmentComplete,
      saveState: assignmentSaveState,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            complete: partComplete,
            saveState: partSaveState,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  filename,
                  size,
                  mimeType: null,
                  complete: uploadSlotComplete,
                  saveState: 'saved',
                  progress: 100,
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileUploadFailed = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const partAnyTextBoxSaving = part.textBoxes
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving ? 'saving' : 'error';

  const partSaveState = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting ? 'saving' : 'error';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      saveState: assignmentSaveState,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return { ...u, saveState: 'save error' };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileDeleteStarted = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignment: {
      ...state.assignment,
      formState: 'dirty',
      saveState: 'saving',
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            formState: 'dirty',
            saveState: 'saving',
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  formState: 'dirty',
                  saveState: 'deleting',
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileDeleteSucceeded = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const uploadSlot = part.uploadSlots.find(u => u.uploadSlotId === uploadSlotId);
  if (!uploadSlot) {
    throw Error('upload slot not found');
  }

  const uploadSlotComplete = false;

  const otherTextBoxesComplete = part.textBoxes
    .filter(t => !t.optional)
    .every(t => t.complete);
  const otherUploadSlotsComplete = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .filter(u => !u.optional)
    .every(u => u.complete);
  const partComplete = (uploadSlotComplete || uploadSlot.optional) && otherTextBoxesComplete && otherUploadSlotsComplete;

  const otherPartsComplete = state.assignment.parts
    .filter(p => p.partId !== partId)
    .filter(p => !p.optional)
    .every(p => p.complete);
  const assignmentComplete = (partComplete || part.optional) && otherPartsComplete;

  // for this part, check if all text boxes and all upload slots (other than this one) are saved
  const partAllTextBoxesSaved = part.textBoxes
    .every(t => t.formState === 'pristine' || t.savedText === t.text);
  const partAllUploadSlotsSavedOrEmpty = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = part.textBoxes
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'save error' || u.saveState === 'delete error');

  const partAnyTextBoxSaving = part.textBoxes
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignment.parts
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving
    ? 'saving'
    : assignmentAnyPartError
      ? 'error'
      : assignmentAllPartsSaved ? 'saved' : 'unsaved';

  const partSaveState = partAnyTextBoxSaving
    ? 'saving'
    : partAnyTextBoxError
      ? 'error'
      : partAllTextBoxesSaved ? 'saved' : 'unsaved';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      complete: assignmentComplete,
      saveState: assignmentSaveState,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            complete: partComplete,
            saveState: partSaveState,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  filename: null,
                  size: null,
                  mimeType: null,
                  complete: uploadSlotComplete,
                  saveState: 'empty',
                  progress: 0,
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};

const fileDeleteFailed = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const part = state.assignment.parts.find(p => p.partId === partId);
  if (!part) {
    throw Error('part not found');
  }

  const partAnyTextBoxSaving = part.textBoxes
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSavingOrDeleting = part.uploadSlots
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving' || u.saveState === 'deleting');

  const partSaveState = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting ? 'saving' : 'error';

  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSavingOrDeleting || state.assignment.parts
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');
  const assignmentSaveState = assignmentAnyPartSaving ? 'saving' : 'error';

  return {
    ...state,
    assignment: {
      ...state.assignment,
      saveState: assignmentSaveState,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return { ...u, saveState: 'delete error' };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
  };
};
