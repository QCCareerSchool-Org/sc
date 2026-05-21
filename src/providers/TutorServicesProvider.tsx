import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { INewAssignmentService } from '@/services/tutors/newAssignmentService';
import { NewAssignmentService } from '@/services/tutors/newAssignmentService';
import type { INewSubmissionService } from '@/services/tutors/newSubmissionService';
import { NewSubmissionService } from '@/services/tutors/newSubmissionService';
import { type IStudentService, StudentService } from '@/services/tutors/studentService';

export interface TutorServices {
  newAssignmentService: INewAssignmentService;
  newSubmissionService: INewSubmissionService;
  studentService: IStudentService;
}

export const TutorServicesContext = createContext<TutorServices | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const TutorServicesProvider: FC<Props> = ({ children }) => {
  const { httpService } = useServices();
  const [ state ] = useState({
    newAssignmentService: new NewAssignmentService(httpService),
    newSubmissionService: new NewSubmissionService(httpService),
    studentService: new StudentService(httpService),
  });

  return (
    <TutorServicesContext.Provider value={state}>
      {children}
    </TutorServicesContext.Provider>
  );
};
