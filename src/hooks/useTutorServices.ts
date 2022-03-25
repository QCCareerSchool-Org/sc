import { useContext } from 'react';

import type { TutorServices } from '../providers/TutorServicesProvider';
import { TutorServicesContext } from '../providers/TutorServicesProvider';

export const useTutorServices = (): TutorServices => {
  const state = useContext(TutorServicesContext);
  if (typeof state === 'undefined') {
    throw Error('useTutorServices must be used within a TutorServicesProvider');
  }
  return state;
};
