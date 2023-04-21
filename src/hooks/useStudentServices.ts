import { useContext } from 'react';

import type { StudentServices } from '@/providers/StudentServicesProvider';
import { StudentServicesContext } from '@/providers/StudentServicesProvider';

export const useStudentServices = (): StudentServices => {
  const state = useContext(StudentServicesContext);
  if (typeof state === 'undefined') {
    throw Error('useStudentServices must be used within a StudentServicesProvider');
  }
  return state;
};
