import { useContext } from 'react';

import { NavStateContext } from '../providers/NavStateProvider';
import type { NavState } from '../state/nav';

export const useNavState = (): NavState => {
  const state = useContext(NavStateContext);
  if (typeof state === 'undefined') {
    throw Error('useNavState must be used within a NavStateProvider');
  }
  return state;
};
