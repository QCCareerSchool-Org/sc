import { instance } from '../axiosInstance';
import { AxiosHttpService } from './httpService';

export const axiosHttpService = new AxiosHttpService(instance);
