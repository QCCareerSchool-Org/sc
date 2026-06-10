import type { Certificate } from '@/domain/certificate';

type State =
  | { fetchState: 'idle'; certificate?: undefined; error?: undefined }
  | { fetchState: 'fetching'; certificate?: undefined; error?: undefined }
  | { fetchState: 'success'; certificate: Certificate; error?: undefined }
  | { fetchState: 'error'; certificate?: undefined; error: { code: number; message: string } };

type Action =
  | { type: 'FETCH_STARTED' }
  | { type: 'CERTIFICATE_LOADED'; payload: Certificate }
  | { type: 'CERTIFICATE_FAILED'; payload: { code: number; message: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_STARTED':
      return { ...state, fetchState: 'fetching', certificate: undefined, error: undefined };
    case 'CERTIFICATE_LOADED':
      return { ...state, fetchState: 'success', certificate: action.payload, error: undefined };
    case 'CERTIFICATE_FAILED':
      return { ...state, fetchState: 'error', certificate: undefined, error: action.payload };
  }
};

export const initialState: State = {
  fetchState: 'idle',
};
