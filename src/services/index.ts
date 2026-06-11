import { CertificateService } from './certificateService';
import { CRMCountryService } from './crmCountryService';
import { CRMProvinceService } from './crmProvinceService';
import { CRMTelephoneCountryCodeService } from './crmTelephoneCountryCodeService';
import { GradeService } from './gradeService';
import { AxiosHttpService } from './httpService';
import { LoginService } from './loginService';
import { PasswordResetRequestService } from './passwordResetRequestService';
import { UUIDService } from './uuidService';
import { VideoService } from './videoService';
import { instance } from 'src/axiosInstance';

const axiosHttpService = new AxiosHttpService(instance);

export const loginService = new LoginService(axiosHttpService);
export const passwordResetRequestService = new PasswordResetRequestService(axiosHttpService);
export const uuidService = new UUIDService();
export const gradeService = new GradeService();
export const videoService = new VideoService(axiosHttpService);
export const crmTelephoneCountryCodeService = new CRMTelephoneCountryCodeService(axiosHttpService);
export const crmCountryService = new CRMCountryService(axiosHttpService);
export const crmProvinceService = new CRMProvinceService(axiosHttpService);
export const certificateService = new CertificateService(axiosHttpService);
