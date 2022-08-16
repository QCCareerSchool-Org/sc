import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { INewAssignmentService } from '@/services/tutors/newAssignmentService';
import { NewAssignmentService } from '@/services/tutors/newAssignmentService';
import type { INewUnitService } from '@/services/tutors/newUnitService';
import { NewUnitService } from '@/services/tutors/newUnitService';

export type TutorServices = {
  newAssignmentService: INewAssignmentService;
  newUnitService: INewUnitService;
};

export const TutorServicesContext = createContext<TutorServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const TutorServicesProvider: FC<Props> = ({ children }) => {
  const { httpService } = useServices();
  const [ state ] = useState({
    newAssignmentService: new NewAssignmentService(httpService),
    newUnitService: new NewUnitService(httpService),
  });

  return (
    <TutorServicesContext.Provider value={state}>
      {children}
    </TutorServicesContext.Provider>
  );
};
