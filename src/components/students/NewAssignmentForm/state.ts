import { NewAssignmentWithChildren } from '@/services/students';

type SaveState = 'saved' | 'unsaved' | 'saving' | 'error';
type FormState = 'pristine' | 'dirty';

export type TextBoxState = {
  textBoxId: string;
  formState: FormState;
  saveState: null | 'saving' | 'error'; // saved and unsaved states represented by whether savedText is the latest text
  savedText: string;
};

export type UploadSlotState = {
  uploadSlotId: string;
  formState: FormState;
  saveState: 'empty' | 'saved' | 'saving' | 'error';
  progress: number;
};

export type PartState = {
  partId: string;
  formState: FormState;
  saveState: SaveState;
  textBoxStates: TextBoxState[];
  uploadSlotStates: UploadSlotState[];
};

export type AssignmentState = {
  formState: FormState;
  saveState: SaveState;
  partStates: PartState[];
};

export type State = {
  assignment?: NewAssignmentWithChildren;
  assignmentState: AssignmentState;
  error: boolean;
};

export const initialState: State = {
  assignmentState: {
    formState: 'pristine',
    saveState: 'saved',
    partStates: [],
  },
  error: false,
};

export type Action =
  | { type: 'ASSIGNMENT_LOADED'; payload: NewAssignmentWithChildren }
  | { type: 'ASSIGNMENT_ERROR' }
  | { type: 'TEXT_CHANGED'; payload: { partId: string; textBoxId: string; text: string } }
  | { type: 'TEXT_SAVE_REQUESTED'; payload: { partId: string; textBoxId: string } }
  | { type: 'TEXT_SAVED'; payload: { partId: string; textBoxId: string; text: string } }
  | { type: 'TEXT_ERRORED'; payload: { partId: string; textBoxId: string } }
  | { type: 'FILE_UPLOAD_PROGRESSED'; payload: { partId: string; uploadSlotId: string; progress: number } }
  | { type: 'FILE_UPLOADED'; payload: { partId: string; uploadSlotId: string; filename: string; size: number } }
  | { type: 'FILE_DELETED'; payload: { partId: string; uploadSlotId: string } }
  | { type: 'FILE_ERRORED'; payload: { partId: string; uploadSlotId: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ASSIGNMENT_LOADED':
      return assignmentLoad(state, action.payload);
    case 'ASSIGNMENT_ERROR':
      return { ...state, error: true };
    case 'TEXT_CHANGED':
      return textBoxTextChange(state, action.payload.partId, action.payload.textBoxId, action.payload.text);
    case 'TEXT_SAVE_REQUESTED':
      return textBoxSaving(state, action.payload.partId, action.payload.textBoxId);
    case 'TEXT_SAVED':
      return textBoxSaved(state, action.payload.partId, action.payload.textBoxId, action.payload.text);
    case 'TEXT_ERRORED':
      return textBoxError(state, action.payload.partId, action.payload.textBoxId);
    case 'FILE_UPLOAD_PROGRESSED':
      return uploadSlotProgress(state, action.payload.partId, action.payload.uploadSlotId, action.payload.progress);
    case 'FILE_UPLOADED':
      return uploadSlotSaved(state, action.payload.partId, action.payload.uploadSlotId, action.payload.filename, action.payload.size);
    case 'FILE_DELETED':
      return uploadSlotDeleted(state, action.payload.partId, action.payload.uploadSlotId);
    case 'FILE_ERRORED':
      return uploadSlotError(state, action.payload.partId, action.payload.uploadSlotId);
  }
};

const assignmentLoad = (state: State, assignment: NewAssignmentWithChildren): State => {
  const assignmentState: AssignmentState = {
    formState: 'pristine',
    saveState: 'saved',
    partStates: assignment.parts.map(p => ({
      partId: p.partId,
      formState: 'pristine',
      saveState: 'saved',
      textBoxStates: p.textBoxes.map(t => ({
        textBoxId: t.textBoxId,
        formState: 'pristine',
        saveState: null,
        savedText: t.text,
      })),
      uploadSlotStates: p.uploadSlots.map(u => ({
        uploadSlotId: u.uploadSlotId,
        formState: 'pristine',
        saveState: u.complete ? 'saved' : 'empty',
        progress: u.complete ? 100 : 0,
      })),
    })),
  };
  return { ...state, assignment, assignmentState, error: false };
};

/**
 * Updates the text for a text box
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textBoxTextChange = (state: State, partId: string, textBoxId: string, text: string): State => {
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
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return { ...t, text };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
    assignmentState: {
      ...state.assignmentState,
      formState: 'dirty',
      saveState: 'unsaved',
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            formState: 'dirty',
            saveState: 'unsaved',
            textBoxStates: p.textBoxStates.map(t => {
              if (t.textBoxId === textBoxId) {
                return {
                  ...t,
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
const textBoxSaving = (state: State, partId: string, textBoxId: string): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    // set the text box data state to pristine
    assignmentState: {
      ...state.assignmentState,
      saveState: 'saving',
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: 'saving',
            textBoxStates: p.textBoxStates.map(t => {
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
const textBoxSaved = (state: State, partId: string, textBoxId: string, text: string): State => {
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

  const partState = state.assignmentState.partStates.find(p => p.partId === partId);
  if (!partState) {
    throw Error('part state not found');
  }

  // for this part, check if all the other text boxes
  // don't filter the array so that we'll have the correct index i to use for looking up the text value
  const partAllTextBoxesSaved = partState.textBoxStates
    .every((t, i) => {
      if (t.textBoxId === textBoxId) {
        return true; // don't count this one
      }
      return t.formState === 'pristine' || t.savedText === part.textBoxes[i].text;
    });
  const partAllUploadSlotsSavedOrEmpty = partState.uploadSlotStates
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = partState.textBoxStates
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = partState.uploadSlotStates
    .some(u => u.saveState === 'error');

  const partAnyTextBoxSaving = partState.textBoxStates
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSaving = partState.uploadSlotStates
    .some(u => u.saveState === 'saving');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSaving || state.assignmentState.partStates
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

  const newState: State = {
    ...state,
    assignment: {
      ...state.assignment,
      complete: assignmentComplete,
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            complete: partComplete,
            textBoxes: p.textBoxes.map(t => {
              if (t.textBoxId === textBoxId) {
                return { ...t, complete: textBoxComplete };
              }
              return t;
            }),
          };
        }
        return p;
      }),
    },
    assignmentState: {
      ...state.assignmentState,
      saveState: assignmentSaveState,
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            textBoxStates: p.textBoxStates.map(t => {
              if (t.textBoxId === textBoxId) {
                return {
                  ...t,
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

  return newState;
};

/**
 * Marks the assignmet, part, and text box as having a save failure
 * @param assignmentData the assignment data
 * @param partId the id of the part to update
 * @param textBoxId the id of the text box to update
 * @param text the new text
 * @returns the new assignment data
 */
const textBoxError = (state: State, partId: string, textBoxId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const partState = state.assignmentState.partStates.find(p => p.partId === partId);
  if (!partState) {
    throw Error('part state not found');
  }

  const partAnyTextBoxSaving = partState.textBoxStates
    .filter(t => t.textBoxId !== textBoxId)
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSaving = partState.uploadSlotStates
    .some(u => u.saveState === 'saving');

  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSaving || state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving ? 'saving' : 'error';

  const partSaveState = partAnyTextBoxSaving || partAnyUploadSlotSaving ? 'saving' : 'error';

  return {
    ...state,
    assignmentState: {
      ...state.assignmentState,
      saveState: assignmentSaveState,
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            textBoxStates: p.textBoxStates.map(t => {
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

const uploadSlotProgress = (state: State, partId: string, uploadSlotId: string, progress: number): State => {
  if (!state.assignment) {
    return state;
  }

  return {
    ...state,
    assignmentState: {
      ...state.assignmentState,
      formState: 'dirty',
      saveState: 'saving',
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            formState: 'dirty',
            saveState: 'saving',
            uploadSlotStates: p.uploadSlotStates.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  formState: 'dirty',
                  saveState: 'saving',
                  progress,
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

const uploadSlotSaved = (state: State, partId: string, uploadSlotId: string, filename: string, size: number): State => {
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

  const partState = state.assignmentState.partStates.find(p => p.partId === partId);
  if (!partState) {
    throw Error('part state not found');
  }

  // for this part, check if all text boxes and all upload slots (other than this one) are saved
  const partAllTextBoxesSaved = partState.textBoxStates
    .every((t, i) => t.formState === 'pristine' || t.savedText === part.textBoxes[i].text);
  const partAllUploadSlotsSavedOrEmpty = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = partState.textBoxStates
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'error');

  const partAnyTextBoxSaving = partState.textBoxStates
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSaving = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSaving || state.assignmentState.partStates
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
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            complete: partComplete,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  filename,
                  size,
                  mimeType: null,
                  complete: uploadSlotComplete,
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
    assignmentState: {
      ...state.assignmentState,
      saveState: assignmentSaveState,
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            uploadSlotStates: p.uploadSlotStates.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
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

const uploadSlotDeleted = (state: State, partId: string, uploadSlotId: string): State => {
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

  const partState = state.assignmentState.partStates.find(p => p.partId === partId);
  if (!partState) {
    throw Error('part state not found');
  }

  // for this part, check if all text boxes and all upload slots (other than this one) are saved
  const partAllTextBoxesSaved = partState.textBoxStates
    .every((t, i) => t.formState === 'pristine' || t.savedText === part.textBoxes[i].text);
  const partAllUploadSlotsSavedOrEmpty = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .every(u => u.formState === 'pristine' || u.saveState === 'saved' || u.saveState === 'empty');

  const partAnyTextBoxError = partState.textBoxStates
    .some(t => t.saveState === 'error');
  const partAnyUploadSlotError = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'error');

  const partAnyTextBoxSaving = partState.textBoxStates
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSaving = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving');

  // check the other parts
  const assignmentAllPartsSaved = partAllTextBoxesSaved && partAllUploadSlotsSavedOrEmpty && state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .every(p => p.formState === 'pristine' || p.saveState === 'saved');
  const assignmentAnyPartError = partAnyTextBoxError || partAnyUploadSlotError || state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'error');
  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSaving || state.assignmentState.partStates
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
      parts: state.assignment.parts.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            complete: partComplete,
            uploadSlots: p.uploadSlots.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
                  filename: null,
                  size: null,
                  mimeType: null,
                  complete: uploadSlotComplete,
                };
              }
              return u;
            }),
          };
        }
        return p;
      }),
    },
    assignmentState: {
      ...state.assignmentState,
      saveState: assignmentSaveState,
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            uploadSlotStates: p.uploadSlotStates.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return {
                  ...u,
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

const uploadSlotError = (state: State, partId: string, uploadSlotId: string): State => {
  if (!state.assignment) {
    return state;
  }

  const partState = state.assignmentState.partStates.find(p => p.partId === partId);
  if (!partState) {
    throw Error('part state not found');
  }

  const partAnyTextBoxSaving = partState.textBoxStates
    .some(t => t.saveState === 'saving');
  const partAnyUploadSlotSaving = partState.uploadSlotStates
    .filter(u => u.uploadSlotId !== uploadSlotId)
    .some(u => u.saveState === 'saving');

  const assignmentAnyPartSaving = partAnyTextBoxSaving || partAnyUploadSlotSaving || state.assignmentState.partStates
    .filter(p => p.partId !== partId)
    .some(p => p.saveState === 'saving');

  const assignmentSaveState = assignmentAnyPartSaving ? 'saving' : 'error';

  const partSaveState = partAnyTextBoxSaving || partAnyUploadSlotSaving ? 'saving' : 'error';

  return {
    ...state,
    assignmentState: {
      ...state.assignmentState,
      saveState: assignmentSaveState,
      partStates: state.assignmentState.partStates.map(p => {
        if (p.partId === partId) {
          return {
            ...p,
            saveState: partSaveState,
            uploadSlotStates: p.uploadSlotStates.map(u => {
              if (u.uploadSlotId === uploadSlotId) {
                return { ...u, saveState: 'error' };
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
