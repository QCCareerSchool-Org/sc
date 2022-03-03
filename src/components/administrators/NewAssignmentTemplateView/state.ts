import type { NewAssignmentTemplateWithParts } from '@/services/administrators';

export type State = {
  assignmentTemplate?: NewAssignmentTemplateWithParts;
  error: boolean;
  errorCode?: number;
};

type Action =
  | { type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED'; payload: NewAssignmentTemplateWithParts }
  | { type: 'UNIT_TEMPLATE_LOAD_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UNIT_TEMPLATE_LOAD_SUCCEEDED':
      return { ...state, assignmentTemplate: action.payload, error: false };
    case 'UNIT_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
