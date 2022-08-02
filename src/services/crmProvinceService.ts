import type { Observable } from 'rxjs';

import { crmEndpoint } from '../basePath';
import type { CRMProvince } from '@/domain/crm/crmProvince';
import type { IHttpService } from '@/services/httpService';

export interface ICRMProvinceService {
  getAllCRMProvincesByCountryCode: (countryCode: string) => Observable<CRMProvince[]>;
}

export class CRMProvinceService implements ICRMProvinceService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllCRMProvincesByCountryCode(countryCode: string): Observable<CRMProvince[]> {
    const url = `${this.getUrl()}?countryCode=${encodeURIComponent(countryCode)}`;
    return this.httpService.get<CRMProvince[]>(url);
  }

  private getUrl(): string {
    return `${crmEndpoint}/provinces`;
  }
}
