import { useContext } from 'react';

import type { AuditorServices } from '@/providers/AuditorServicesProvider';
import { AuditorServicesContext } from '@/providers/AuditorServicesProvider';

export const useAuditorServices = (): AuditorServices => {
  const state = useContext(AuditorServicesContext);
  if (typeof state === 'undefined') {
    throw Error('useAuditorServices must be used within an AuditorServicesProvider');
  }
  return state;
};
