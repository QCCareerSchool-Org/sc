import type { NewUnitTemplateWithAssignments } from '@/services/administrators';

export type State = {
  unitTemplate?: NewUnitTemplateWithAssignments;
  error: boolean;
};

type Action =
  | { type: 'UNIT_TEMPLATE_LOAD_SUCCEEDED'; payload: NewUnitTemplateWithAssignments }
  | { type: 'UNIT_TEMPLATE_LOAD_FAILED' };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UNIT_TEMPLATE_LOAD_SUCCEEDED':
      return { ...state, unitTemplate: action.payload, error: false };
    case 'UNIT_TEMPLATE_LOAD_FAILED':
      return { ...state, error: true };
  }
};
