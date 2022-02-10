import { Dispatch, useContext } from 'react';

import { AuthDispatchContext } from '../providers/AuthStateProvider';
import { AuthAction } from '../state/auth';

export const useAuthDispatch = (): Dispatch<AuthAction> => {
  const dispatch = useContext(AuthDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useAuthDispatch must be used within an AuthStateProvider');
  }
  return dispatch;
};
