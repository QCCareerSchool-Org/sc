import { useContext } from 'react';

import { AuthStateContext } from '../providers/AuthStateProvider';
import type { AuthState } from '../state/auth';

export const useAuthState = (): AuthState => {
  const state = useContext(AuthStateContext);
  if (typeof state === 'undefined') {
    throw Error('useAuthState must be used within an AuthStateProvider');
  }
  return state;
};
