import type { School } from '@/domain/school';

export type State = {
  schools?: School[];
  error: boolean;
};

type Action =
  | { type: 'SCHOOLS_LOAD_SUCCEEDED'; payload: School[] }
  | { type: 'SCHOOLS_LOAD_FAILED' };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SCHOOLS_LOAD_SUCCEEDED':
      return { ...state, schools: action.payload, error: false };
    case 'SCHOOLS_LOAD_FAILED':
      return { ...state, error: true };
  }
};
