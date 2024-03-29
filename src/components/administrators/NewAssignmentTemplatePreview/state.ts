import type { NewAssignmentTemplateWithSubmissionTemplateAndChildren } from '@/services/administrators/newAssignmentTemplateService';
import { sanitize } from 'src/sanitize';

export type State = {
  assignmentTemplate?: NewAssignmentTemplateWithSubmissionTemplateAndChildren;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED'; payload: NewAssignmentTemplateWithSubmissionTemplateAndChildren }
  | { type: 'LOAD_ASSIGNMENT_TEMPLATE_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED':
      return {
        ...state,
        assignmentTemplate: {
          ...action.payload,
          newPartTemplates: action.payload.newPartTemplates.map(p => ({
            ...p,
            description: p.description === null
              ? null
              : p.descriptionType === 'text' ? p.description : sanitize(p.description),
          })),
        },
        error: false,
      };
    case 'LOAD_ASSIGNMENT_TEMPLATE_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
