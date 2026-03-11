import { useContext } from 'react';

import { ScreenWidthContext } from '@/providers/ScreenWidthProvider';

export const useScreenWidthContext = (): number | null => {
  const state = useContext(ScreenWidthContext);
  if (typeof state === 'undefined') {
    throw Error('useScreenWidthContext must be used inside a ScreenWidthProvider');
  }
  return state;
};
