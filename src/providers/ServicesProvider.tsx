import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { instance } from '../axiosInstance';
import type { ICRMCountryService } from '@/services/crmCountryService';
import { CRMCountryService } from '@/services/crmCountryService';
import type { ICRMProvinceService } from '@/services/crmProvinceService';
import { CRMProvinceService } from '@/services/crmProvinceService';
import type { ICRMTelephoneCountryCodeService } from '@/services/crmTelephoneCountryCodeService';
import { CRMTelephoneCountryCodeService } from '@/services/crmTelephoneCountryCodeService';
import type { IGradeService } from '@/services/gradeService';
import { GradeService } from '@/services/gradeService';
import type { IHttpService } from '@/services/httpService';
import { AxiosHttpService } from '@/services/httpService';
import type { ILoginService } from '@/services/loginService';
import { LoginService } from '@/services/loginService';
import type { IPasswordResetRequestService } from '@/services/passwordResetRequestService';
import { PasswordResetRequestService } from '@/services/passwordResetRequestService';
import type { IUUIDService } from '@/services/uuidService';
import { UUIDService } from '@/services/uuidService';

export type Services = {
  httpService: IHttpService;
  loginService: ILoginService;
  passwordResetRequestService: IPasswordResetRequestService;
  uuidService: IUUIDService;
  gradeService: IGradeService;
  crmTelephoneCountryCodeService: ICRMTelephoneCountryCodeService;
  crmCountryService: ICRMCountryService;
  crmProvinceService: ICRMProvinceService;
};

export const ServicesContext = createContext<Services | undefined>(undefined);

const axiosHttpService = new AxiosHttpService(instance);

type Props = {
  children: ReactNode;
};

export const ServicesProvider = ({ children }: Props): ReactElement => {
  const [ state ] = useState({
    httpService: axiosHttpService,
    loginService: new LoginService(axiosHttpService),
    passwordResetRequestService: new PasswordResetRequestService(axiosHttpService),
    uuidService: new UUIDService(),
    gradeService: new GradeService(),
    crmTelephoneCountryCodeService: new CRMTelephoneCountryCodeService(axiosHttpService),
    crmCountryService: new CRMCountryService(axiosHttpService),
    crmProvinceService: new CRMProvinceService(axiosHttpService),
  });

  return (
    <ServicesContext.Provider value={state}>
      {children}
    </ServicesContext.Provider>
  );
};
