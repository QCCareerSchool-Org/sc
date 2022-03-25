import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';

import type { IHttpService } from '@/services/httpService';
import { AxiosHttpService } from '@/services/httpService';
import type { ILoginService } from '@/services/loginService';
import { LoginService } from '@/services/loginService';
import type { IUUIDService } from '@/services/uuidService';
import { UUIDService } from '@/services/uuidService';
import { instance } from 'src/axiosInstance';

export type Services = {
  httpService: IHttpService;
  loginService: ILoginService;
  uuidService: IUUIDService;
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
    uuidService: new UUIDService(),
  });

  return (
    <ServicesContext.Provider value={state}>
      {children}
    </ServicesContext.Provider>
  );
};
