import { instance } from '../observableAxiosInstance';
import { LoginService } from './loginService';
import { ObservableAxiosHttpService } from './observableHttpService';

export const observableAxiosHttpService = new ObservableAxiosHttpService(instance);
export const loginService = new LoginService(observableAxiosHttpService);
