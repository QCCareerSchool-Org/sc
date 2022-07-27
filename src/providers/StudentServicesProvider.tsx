import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { ICRMEnrollmentService } from '@/services/students/crmEnrollmentService';
import { CRMEnrollmentService } from '@/services/students/crmEnrollmentService';
import type { ICRMPaymentMethodService } from '@/services/students/crmPaymentMethodService';
import { CRMPaymentMethodService } from '@/services/students/crmPaymentMethodService';
import type { ICRMStudentService } from '@/services/students/crmStudentService';
import { CRMStudentService } from '@/services/students/crmStudentService';
import type { IEnrollmentService } from '@/services/students/enrollmentService';
import { EnrollmentService } from '@/services/students/enrollmentService';
import type { INewAssignmentService } from '@/services/students/newAssignmentService';
import { NewAssignmentService } from '@/services/students/newAssignmentService';
import type { INewUnitService } from '@/services/students/newUnitService';
import { NewUnitService } from '@/services/students/newUnitService';
import type { IStudentService } from '@/services/students/studentService';
import { StudentService } from '@/services/students/studentService';

export type StudentServices = {
  studentService: IStudentService;
  enrollmentService: IEnrollmentService;
  newAssignmentService: INewAssignmentService;
  newUnitService: INewUnitService;
  crmStudentService: ICRMStudentService;
  crmEnrollmentService: ICRMEnrollmentService;
  crmPaymentMethodService: ICRMPaymentMethodService;
};

export const StudentServicesContext = createContext<StudentServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StudentServicesProvider = ({ children }: Props): ReactElement => {
  const { httpService } = useServices();
  const [ state ] = useState({
    studentService: new StudentService(httpService),
    enrollmentService: new EnrollmentService(httpService),
    newAssignmentService: new NewAssignmentService(httpService),
    newUnitService: new NewUnitService(httpService),
    crmStudentService: new CRMStudentService(httpService),
    crmEnrollmentService: new CRMEnrollmentService(httpService),
    crmPaymentMethodService: new CRMPaymentMethodService(httpService),
  });

  return (
    <StudentServicesContext.Provider value={state}>
      {children}
    </StudentServicesContext.Provider>
  );
};
