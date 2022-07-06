import { useContext } from 'react';

import { UnitToggleStateContext } from '../providers/UnitToggleStateProvider';
import type { UnitToggleState } from '../state/unitToggles';

export const useUnitToggleState = (): UnitToggleState => {
  const state = useContext(UnitToggleStateContext);
  if (typeof state === 'undefined') {
    throw Error('useUnitToggleState must be used within an UnitToggleStateProvider');
  }
  return state;
};
