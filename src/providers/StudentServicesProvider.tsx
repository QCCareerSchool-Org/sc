import type { FC, ReactNode } from 'react';
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
import type { IMaterialService } from '@/services/students/materialService';
import { MaterialService } from '@/services/students/materialService';
import type { INewAssignmentService } from '@/services/students/newAssignmentService';
import { NewAssignmentService } from '@/services/students/newAssignmentService';
import type { INewSubmissionService } from '@/services/students/newSubmissionService';
import { NewSubmissionService } from '@/services/students/newSubmissionService';
import type { IStudentService } from '@/services/students/studentService';
import { StudentService } from '@/services/students/studentService';
import type { IT2202ReceiptService } from '@/services/students/t2202ReceiptService';
import { T2202ReceiptService } from '@/services/students/t2202ReceiptService';
import type { IVideoService } from '@/services/students/videoService';
import { VideoService } from '@/services/students/videoService';

export type StudentServices = {
  studentService: IStudentService;
  enrollmentService: IEnrollmentService;
  newAssignmentService: INewAssignmentService;
  newSubmissionService: INewSubmissionService;
  materialService: IMaterialService;
  videoService: IVideoService;
  t2202ReceiptService: IT2202ReceiptService;
  crmStudentService: ICRMStudentService;
  crmEnrollmentService: ICRMEnrollmentService;
  crmPaymentMethodService: ICRMPaymentMethodService;
};

export const StudentServicesContext = createContext<StudentServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StudentServicesProvider: FC<Props> = ({ children }) => {
  const { httpService } = useServices();
  const [ state ] = useState({
    studentService: new StudentService(httpService),
    enrollmentService: new EnrollmentService(httpService),
    newAssignmentService: new NewAssignmentService(httpService),
    newSubmissionService: new NewSubmissionService(httpService),
    materialService: new MaterialService(httpService),
    videoService: new VideoService(httpService),
    t2202ReceiptService: new T2202ReceiptService(httpService),
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
