import type { NewTextBoxTemplate, NewUploadSlotTemplate } from '@/domain/index';
import type { NewPartTemplateWithInputs } from '@/services/administrators';
import { uuidService } from '@/services/index';

export type State = {
  partTemplate?: NewPartTemplateWithInputs;
  nextTextBoxOrder: number;
  nextUploadSlotOrder: number;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'PART_TEMPLATE_LOAD_SUCCEEDED'; payload: NewPartTemplateWithInputs }
  | { type: 'PART_TEMPLATE_LOAD_FAILED'; payload?: number }
  | { type: 'ADD_TEXT_BOX_SUCCEEDED'; payload: NewTextBoxTemplate }
  | { type: 'ADD_UPLOAD_SLOT_SUCCEEDED'; payload: NewUploadSlotTemplate };

export const initialState: State = {
  nextTextBoxOrder: 0,
  nextUploadSlotOrder: 0,
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PART_TEMPLATE_LOAD_SUCCEEDED':
      return {
        ...state,
        partTemplate: action.payload,
        nextTextBoxOrder: action.payload.textBoxes.length ? Math.max(...action.payload.textBoxes.map(t => t.order)) + 1 : 0,
        nextUploadSlotOrder: action.payload.uploadSlots.length ? Math.max(...action.payload.uploadSlots.map(u => u.order)) + 1 : 0,
        error: false,
      };
    case 'PART_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
    case 'ADD_TEXT_BOX_SUCCEEDED': {
      if (!state.partTemplate) {
        throw Error('partTemplate is undefined');
      }
      const textBoxes = [ ...state.partTemplate.textBoxes, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.textBoxId, b.textBoxId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        partTemplate: {
          ...state.partTemplate,
          textBoxes,
        },
        nextTextBoxOrder: Math.max(...textBoxes.map(t => t.order)) + 1,
      };
    }
    case 'ADD_UPLOAD_SLOT_SUCCEEDED': {
      if (!state.partTemplate) {
        throw Error('partTemplate is undefined');
      }
      const uploadSlots = [ ...state.partTemplate.uploadSlots, action.payload ].sort((a, b) => {
        if (a.order === b.order) {
          return uuidService.compare(a.uploadSlotId, b.uploadSlotId);
        }
        return a.order - b.order;
      });
      return {
        ...state,
        partTemplate: {
          ...state.partTemplate,
          uploadSlots,
        },
        nextUploadSlotOrder: Math.max(...uploadSlots.map(u => u.order)) + 1,
      };
    }
  }
};
