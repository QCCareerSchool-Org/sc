import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { useServices } from '@/hooks/useServices';
import type { ICountryService } from '@/services/administrators/countryService';
import { CountryService } from '@/services/administrators/countryService';
import type { ICourseService } from '@/services/administrators/courseService';
import { CourseService } from '@/services/administrators/courseService';
import type { ICurrencyService } from '@/services/administrators/currencyService';
import { CurrencyService } from '@/services/administrators/currencyService';
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
import type { INewUnitTemplatePriceService } from '@/services/administrators/newUnitTemplatePriceService';
import { NewUnitTemplatePriceService } from '@/services/administrators/newUnitTemplatePriceService';
import type { INewUnitTemplateService } from '@/services/administrators/newUnitTemplateService';
import { NewUnitTemplateService } from '@/services/administrators/newUnitTemplateService';
import type { INewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import { NewUploadSlotTemplateService } from '@/services/administrators/newUploadSlotTemplateService';
import type { ISchoolService } from '@/services/administrators/schoolService';
import { SchoolService } from '@/services/administrators/schoolService';

export type AdminServices = Readonly<{
  readonly courseService: Readonly<ICourseService>;
  readonly countryService: Readonly<ICountryService>;
  readonly currencyService: Readonly<ICurrencyService>;
  readonly newAssignmentMediumService: Readonly<INewAssignmentMediumService>;
  readonly newAssignmentTemplateService: Readonly<INewAssignmentTemplateService>;
  readonly newPartMediumService: Readonly<INewPartMediumService>;
  readonly newPartTemplateService: Readonly<INewPartTemplateService>;
  readonly newTextBoxTemplateService: Readonly<INewTextBoxTemplateService>;
  readonly newUnitService: Readonly<INewUnitService>;
  readonly newUnitTemplateService: Readonly<INewUnitTemplateService>;
  readonly newUploadSlotTemplateService: Readonly<INewUploadSlotTemplateService>;
  readonly newUnitTemplatePriceService: Readonly<INewUnitTemplatePriceService>;
  readonly schoolService: Readonly<ISchoolService>;
}>;

export const AdminServicesContext = createContext<AdminServices | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AdminServicesProvider = ({ children }: Props): ReactElement => {
  const { httpService } = useServices();
  const [ state ] = useState({
    courseService: new CourseService(httpService),
    countryService: new CountryService(httpService),
    currencyService: new CurrencyService(httpService),
    newAssignmentMediumService: new NewAssignmentMediumService(httpService),
    newAssignmentTemplateService: new NewAssignmentTemplateService(httpService),
    newPartMediumService: new NewPartMediumService(httpService),
    newPartTemplateService: new NewPartTemplateService(httpService),
    newTextBoxTemplateService: new NewTextBoxTemplateService(httpService),
    newUnitService: new NewUnitService(httpService),
    newUnitTemplateService: new NewUnitTemplateService(httpService),
    newUploadSlotTemplateService: new NewUploadSlotTemplateService(httpService),
    newUnitTemplatePriceService: new NewUnitTemplatePriceService(httpService),
    schoolService: new SchoolService(httpService),
  } as const);

  return (
    <AdminServicesContext.Provider value={state}>
      {children}
    </AdminServicesContext.Provider>
  );
};
