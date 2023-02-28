import { useContext } from 'react';

import { ScrollbarWidthContext } from '../providers/ScrollbarWidthProvider';

export const useScrollbarWidth = (): number => {
  const state = useContext(ScrollbarWidthContext);
  if (typeof state === 'undefined') {
    throw Error('useScrollbarWidth must be used within an ScrollbarWidthProvider');
  }
  return state;
};
