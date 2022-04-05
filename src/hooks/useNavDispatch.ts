import type { Dispatch } from 'react';
import { useContext } from 'react';

import { NavDispatchContext } from '../providers/NavStateProvider';
import type { NavAction } from '../state/nav';

export const useNavDispatch = (): Dispatch<NavAction> => {
  const dispatch = useContext(NavDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useNavDispatch must be used within a NavStateProvider');
  }
  return dispatch;
};
