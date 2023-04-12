import type { Dispatch } from 'react';
import { useContext } from 'react';

import { AuthDispatchContext } from '@/providers/AuthStateProvider';
import type { AuthAction } from '@/state/auth';

export const useAuthDispatch = (): Dispatch<AuthAction> => {
  const dispatch = useContext(AuthDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useAuthDispatch must be used within an AuthStateProvider');
  }
  return dispatch;
};
