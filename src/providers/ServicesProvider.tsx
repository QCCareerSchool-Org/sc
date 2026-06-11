import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { certificateService, crmCountryService, crmProvinceService, crmTelephoneCountryCodeService, gradeService, loginService, passwordResetRequestService, uuidService, videoService } from '../services';
import type { ICertificateService } from '@/services/certificateService';
import { CertificateService } from '@/services/certificateService';
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
import type { IVideoService } from '@/services/videoService';
import { VideoService } from '@/services/videoService';
import { instance } from 'src/axiosInstance';

export interface Services {
  httpService: IHttpService;
  loginService: ILoginService;
  passwordResetRequestService: IPasswordResetRequestService;
  uuidService: IUUIDService;
  gradeService: IGradeService;
  videoService: IVideoService;
  crmTelephoneCountryCodeService: ICRMTelephoneCountryCodeService;
  crmCountryService: ICRMCountryService;
  crmProvinceService: ICRMProvinceService;
  certificateService: ICertificateService;
}

export const ServicesContext = createContext<Services | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ServicesProvider: FC<Props> = ({ children }) => {
  const [ state ] = useState({
    httpService: AxiosHttpService,
    loginService,
    passwordResetRequestService,
    uuidService,
    gradeService,
    videoService,
    crmTelephoneCountryCodeService,
    crmCountryService,
    crmProvinceService,
    certificateService,
  });

  return (
    <ServicesContext.Provider value={state}>
      {children}
    </ServicesContext.Provider>
  );
};
