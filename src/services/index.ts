import { AxiosHttpService } from './httpService';
import { LoginService } from './loginService';
import { instance } from 'src/axiosInstance';

export const axiosHttpService = new AxiosHttpService(instance);
export const loginService = new LoginService(axiosHttpService);
