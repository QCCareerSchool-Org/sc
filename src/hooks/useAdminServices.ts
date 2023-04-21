import { useContext } from 'react';

import type { AdminServices } from '@/providers/AdminServicesProvider';
import { AdminServicesContext } from '@/providers/AdminServicesProvider';

export const useAdminServices = (): AdminServices => {
  const state = useContext(AdminServicesContext);
  if (typeof state === 'undefined') {
    throw Error('useAdminServices must be used within an AdminServicesProvider');
  }
  return state;
};
