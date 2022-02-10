import { useContext } from 'react';

import { ScreenWidthContext } from '../providers/ScreenWidthProvider';

export const useScreenWidth = (): number => {
  const state = useContext(ScreenWidthContext);
  if (typeof state === 'undefined') {
    throw Error('useScreenWidth must be used inside a ScreenWidthProvider');
  }
  return state;
};
