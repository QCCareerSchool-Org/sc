import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { IStudentService } from '@/services/auditors/studentService';
import { StudentService } from '@/services/auditors/studentService';

export type AuditorServices = {
  studentService: IStudentService;
};

export const AuditorServicesContext = createContext<AuditorServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuditorServicesProvider: FC<Props> = ({ children }) => {
  const { httpService } = useServices();
  const [ state ] = useState({
    studentService: new StudentService(httpService),
  });

  return (
    <AuditorServicesContext.Provider value={state}>
      {children}
    </AuditorServicesContext.Provider>
  );
};
