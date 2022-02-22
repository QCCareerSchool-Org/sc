import { instance } from '../observableAxiosInstance';
import { ObservableAxiosHttpService } from './observableHttpService';

export const observableAxiosHttpService = new ObservableAxiosHttpService(instance);
