import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { IEnrollmentService } from '@/services/students/enrollmentService';
import { EnrollmentService } from '@/services/students/enrollmentService';
import type { INewAssignmentService } from '@/services/students/newAssignmentService';
import { NewAssignmentService } from '@/services/students/newAssignmentService';
import type { INewUnitService } from '@/services/students/newUnitService';
import { NewUnitService } from '@/services/students/newUnitService';

export type StudentServices = {
  enrollmentService: IEnrollmentService;
  newAssignmentService: INewAssignmentService;
  newUnitService: INewUnitService;
};

export const StudentServicesContext = createContext<StudentServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StudentServicesProvider = ({ children }: Props): ReactElement => {
  const { httpService } = useServices();
  const [ state ] = useState({
    enrollmentService: new EnrollmentService(httpService),
    newAssignmentService: new NewAssignmentService(httpService),
    newUnitService: new NewUnitService(httpService),
  });

  return (
    <StudentServicesContext.Provider value={state}>
      {children}
    </StudentServicesContext.Provider>
  );
};
