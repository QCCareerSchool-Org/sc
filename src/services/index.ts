import { instance } from "src/axiosInstance";
import { AxiosHttpService } from "./httpService";
import { LoginService } from "./loginService";
import { PasswordResetRequestService } from "./passwordResetRequestService";

  
  const axiosHttpService = new AxiosHttpService(instance);
  
  
export const loginService = new LoginService(axiosHttpService);
export const passwordResetRequestService = new PasswordResetRequestService(axiosHttpService),
    uuidService: new UUIDService(),
    gradeService: new GradeService(),
    videoService: new VideoService(axiosHttpService),
    crmTelephoneCountryCodeService: new CRMTelephoneCountryCodeService(axiosHttpService),
    crmCountryService: new CRMCountryService(axiosHttpService),
    crmProvinceService: new CRMProvinceService(axiosHttpService),
    certificateService: new CertificateService(axiosHttpService),