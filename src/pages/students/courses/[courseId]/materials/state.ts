import type { Enrollment } from '@/domain/enrollment';
import type { Material } from '@/domain/material';

type Data = {
  material: Material & { materialData: Record<string, string> };
  enrollment: Enrollment;
};

export type State = {
  data?: Data;
  error: boolean;
  errorCode?: number;
};

export type Action =
  | { type: 'LOAD_DATA_SUCCEEDED'; payload: Data }
  | { type: 'LOAD_DATA_FAILED'; payload?: number };

export const initialState: State = {
  error: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_DATA_SUCCEEDED':
      return {
        ...state,
        data: {
          ...action.payload,
        },
        error: false,
      };
    case 'LOAD_DATA_FAILED':
      return { ...state, error: true, errorCode: action.payload };
  }
};
