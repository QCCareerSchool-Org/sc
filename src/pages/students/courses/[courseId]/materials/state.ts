import type { Material } from '@/domain/material';

type MaterialWithData = Material & { materialData: Record<string, string> };

export type State = {
  material?: MaterialWithData;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: MaterialWithData }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        material: {
          ...action.payload,
        },
        error: false,
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
