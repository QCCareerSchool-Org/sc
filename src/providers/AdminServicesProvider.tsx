import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { ICountryService } from '@/services/administrators/countryService';
import { CountryService } from '@/services/administrators/countryService';
import type { ICourseService } from '@/services/administrators/courseService';
import { CourseService } from '@/services/administrators/courseService';
import type { ICurrencyService } from '@/services/administrators/currencyService';
import { CurrencyService } from '@/services/administrators/currencyService';
import type { IMaterialService } from '@/services/administrators/materialService';
import { MaterialService } from '@/services/administrators/materialService';
import type { INewAssignmentMediumService } from '@/services/administrators/newAssignmentMediumService';
import { NewAssignmentMediumService } from '@/services/administrators/newAssignmentMediumService';
import type { INewAssignmentService } from '@/services/administrators/newAssignmentService';
import { NewAssignmentService } from '@/services/administrators/newAssignmentService';
import type { INewAssignmentTemplateService } from '@/services/administrators/newAssignmentTemplateService';
import { NewAssignmentTemplateService } from '@/services/administrators/newAssignmentTemplateService';
import type { INewPartMediumService } from '@/services/administrators/newPartMediumService';
import { NewPartMediumService } from '@/services/administrators/newPartMediumService';
import type { INewPartTemplateService } from '@/services/administrators/newPartTemplateService';
import { NewPartTemplateService } from '@/services/administrators/newPartTemplateService';
import type { INewSubmissionReturnService } from '@/services/administrators/newSubmissionReturnService';
import { NewSubmissionReturnService } from '@/services/administrators/newSubmissionReturnService';
import type { INewSubmissionService } from '@/services/administrators/newSubmissionService';
import { NewSubmissionService } from '@/services/administrators/newSubmissionService';
import type { INewSubmissionTemplatePriceService } from '@/services/administrators/newSubmissionTemplatePriceService';
import { NewSubmissionTemplatePriceService } from '@/services/administrators/newSubmissionTemplatePriceService';
import type { INewSubmissionTemplateService } from '@/services/administrators/newSubmissionTemplateService';
import { NewSubmissionTemplateService } from '@/services/administrators/newSubmissionTemplateService';
import type { INewTextBoxTemplateService } from '@/services/administrators/newTextBoxTemplateService';
import { NewTextBoxTemplateService } from '@/services/administrators/newTextBoxTemplateService';
import type { INewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import { NewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import type { ISchoolService } from '@/services/administrators/schoolService';
import { SchoolService } from '@/services/administrators/schoolService';
import type { IStudentService } from '@/services/administrators/studentService';
import { StudentService } from '@/services/administrators/studentService';
import { UnitService } from '@/services/administrators/unitService';
import type { IUnitService } from '@/services/administrators/unitService';

export type AdminServices = Readonly<{
  readonly studentService: Readonly<IStudentService>;
  readonly courseService: Readonly<ICourseService>;
  readonly countryService: Readonly<ICountryService>;
  readonly currencyService: Readonly<ICurrencyService>;
  readonly newAssignmentMediumService: Readonly<INewAssignmentMediumService>;
  readonly newAssignmentTemplateService: Readonly<INewAssignmentTemplateService>;
  readonly newPartMediumService: Readonly<INewPartMediumService>;
  readonly newPartTemplateService: Readonly<INewPartTemplateService>;
  readonly newTextBoxTemplateService: Readonly<INewTextBoxTemplateService>;
  readonly newSubmissionService: Readonly<INewSubmissionService>;
  readonly newAssignmentService: Readonly<INewAssignmentService>;
  readonly newSubmissionTemplateService: Readonly<INewSubmissionTemplateService>;
  readonly newUploadSlotTemplateService: Readonly<INewUploadSlotTemplateService>;
  readonly newSubmissionTemplatePriceService: Readonly<INewSubmissionTemplatePriceService>;
  readonly newSubmissionReturnService: Readonly<INewSubmissionReturnService>;
  readonly schoolService: Readonly<ISchoolService>;
  readonly materialService: Readonly<IMaterialService>;
  readonly unitService: Readonly<IUnitService>;
}>;

export const AdminServicesContext = createContext<AdminServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AdminServicesProvider: FC<Props> = ({ children }) => {
  const { httpService } = useServices();
  const [ state ] = useState({
    studentService: new StudentService(httpService),
    courseService: new CourseService(httpService),
    countryService: new CountryService(httpService),
    currencyService: new CurrencyService(httpService),
    newAssignmentMediumService: new NewAssignmentMediumService(httpService),
    newAssignmentTemplateService: new NewAssignmentTemplateService(httpService),
    newPartMediumService: new NewPartMediumService(httpService),
    newPartTemplateService: new NewPartTemplateService(httpService),
    newTextBoxTemplateService: new NewTextBoxTemplateService(httpService),
    newSubmissionService: new NewSubmissionService(httpService),
    newAssignmentService: new NewAssignmentService(httpService),
    newSubmissionTemplateService: new NewSubmissionTemplateService(httpService),
    newUploadSlotTemplateService: new NewUploadSlotTemplateService(httpService),
    newSubmissionTemplatePriceService: new NewSubmissionTemplatePriceService(httpService),
    newSubmissionReturnService: new NewSubmissionReturnService(httpService),
    schoolService: new SchoolService(httpService),
    materialService: new MaterialService(httpService),
    unitService: new UnitService(httpService),
  } as const);

  return (
    <AdminServicesContext.Provider value={state}>
      {children}
    </AdminServicesContext.Provider>
  );
};
