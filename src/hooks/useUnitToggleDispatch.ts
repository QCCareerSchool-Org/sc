import type { Dispatch } from 'react';
import { useContext } from 'react';

import { UnitToggleDispatchContext } from '@/providers/UnitToggleStateProvider';
import type { UnitToggleAction } from '@/state/unitToggles';

export const useUnitToggleDispatch = (): Dispatch<UnitToggleAction> => {
  const dispatch = useContext(UnitToggleDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useUnitToggleDispatch must be used within an UnitToggleStateProvider');
  }
  return dispatch;
};
