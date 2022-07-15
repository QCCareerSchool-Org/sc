import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import { instance } from '../axiosInstance';
import { instance as crmInstance } from '../crmAxiosInstance';
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
  crmHttpService: IHttpService;
  loginService: ILoginService;
  passwordResetRequestService: IPasswordResetRequestService;
  uuidService: IUUIDService;
  gradeService: IGradeService;
};

export const ServicesContext = createContext<Services | undefined>(undefined);

const axiosHttpService = new AxiosHttpService(instance);
const crmAxiosHttpService = new AxiosHttpService(crmInstance);

type Props = {
  children: ReactNode;
};

export const ServicesProvider = ({ children }: Props): ReactElement => {
  const [ state ] = useState({
    httpService: axiosHttpService,
    crmHttpService: crmAxiosHttpService,
    loginService: new LoginService(axiosHttpService),
    passwordResetRequestService: new PasswordResetRequestService(axiosHttpService),
    uuidService: new UUIDService(),
    gradeService: new GradeService(),
  });

  return (
    <ServicesContext.Provider value={state}>
      {children}
    </ServicesContext.Provider>
  );
};
