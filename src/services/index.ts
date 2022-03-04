import { AxiosHttpService } from './httpService';
import { LoginService } from './loginService';
import { UUIDService } from './uuidService';
import { instance } from 'src/axiosInstance';

export const axiosHttpService = new AxiosHttpService(instance);
export const loginService = new LoginService(axiosHttpService);
export const uuidService = new UUIDService();
