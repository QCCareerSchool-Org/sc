import { useContext } from 'react';

import type { Services } from '../providers/ServicesProvider';
import { ServicesContext } from '../providers/ServicesProvider';

export const useServices = (): Services => {
  const state = useContext(ServicesContext);
  if (typeof state === 'undefined') {
    throw Error('useServices must be used within a ServicesProvider');
  }
  return state;
};
