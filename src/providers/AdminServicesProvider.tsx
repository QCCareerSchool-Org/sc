import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { ICourseService } from '@/services/administrators/courseService';
import { CourseService } from '@/services/administrators/courseService';
import type { INewAssignmentMediumService } from '@/services/administrators/newAssignmentMediumService';
import { NewAssignmentMediumService } from '@/services/administrators/newAssignmentMediumService';
import type { INewAssignmentTemplateService } from '@/services/administrators/newAssignmentTemplateService';
import { NewAssignmentTemplateService } from '@/services/administrators/newAssignmentTemplateService';
import type { INewPartMediumService } from '@/services/administrators/newPartMediumService';
import { NewPartMediumService } from '@/services/administrators/newPartMediumService';
import type { INewPartTemplateService } from '@/services/administrators/newPartTemplateService';
import { NewPartTemplateService } from '@/services/administrators/newPartTemplateService';
import type { INewTextBoxTemplateService } from '@/services/administrators/newTextBoxTemplateService';
import { NewTextBoxTemplateService } from '@/services/administrators/newTextBoxTemplateService';
import type { INewUnitService } from '@/services/administrators/newUnitService';
import { NewUnitService } from '@/services/administrators/newUnitService';
import type { INewUnitTemplateService } from '@/services/administrators/newUnitTemplateService';
import { NewUnitTemplateService } from '@/services/administrators/newUnitTemplateService';
import type { INewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import { NewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import type { ISchoolService } from '@/services/administrators/schoolService';
import { SchoolService } from '@/services/administrators/schoolService';

export type AdminServices = {
  courseService: ICourseService;
  newAssignmentMediumService: INewAssignmentMediumService;
  newAssignmentTemplateService: INewAssignmentTemplateService;
  newPartMediumService: INewPartMediumService;
  newPartTemplateService: INewPartTemplateService;
  newTextBoxTemplateService: INewTextBoxTemplateService;
  newUnitService: INewUnitService;
  newUnitTemplateService: INewUnitTemplateService;
  newUploadSlotTemplateService: INewUploadSlotTemplateService;
  schoolService: ISchoolService;
};

export const AdminServicesContext = createContext<AdminServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AdminServicesProvider = ({ children }: Props): ReactElement => {
  const { httpService } = useServices();
  const [ state ] = useState({
    courseService: new CourseService(httpService),
    newAssignmentMediumService: new NewAssignmentMediumService(httpService),
    newAssignmentTemplateService: new NewAssignmentTemplateService(httpService),
    newPartMediumService: new NewPartMediumService(httpService),
    newPartTemplateService: new NewPartTemplateService(httpService),
    newTextBoxTemplateService: new NewTextBoxTemplateService(httpService),
    newUnitService: new NewUnitService(httpService),
    newUnitTemplateService: new NewUnitTemplateService(httpService),
    newUploadSlotTemplateService: new NewUploadSlotTemplateService(httpService),
    schoolService: new SchoolService(httpService),
  });

  return (
    <AdminServicesContext.Provider value={state}>
      {children}
    </AdminServicesContext.Provider>
  );
};
