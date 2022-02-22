import { AxiosInstanceService } from './axiosInstanceService';
import { AxiosHttpService } from './httpService';
import { LoginService } from './loginService';

export const axiosInstanceService = new AxiosInstanceService();
export const axiosHttpService = new AxiosHttpService(axiosInstanceService.getInstance());
export const loginService = new LoginService(axiosHttpService);
