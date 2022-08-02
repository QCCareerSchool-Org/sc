import type { Observable } from 'rxjs';

import { crmEndpoint } from '../basePath';
import type { IHttpService } from './httpService';
import type { CRMTelephoneCountryCode } from '@/domain/crm/crmTelephoneCountryCode';

export interface ICRMTelephoneCountryCodeService {
  getTelephoneCountryCodes: () => Observable<CRMTelephoneCountryCode[]>;
}

export class CRMTelephoneCountryCodeService implements ICRMTelephoneCountryCodeService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getTelephoneCountryCodes(): Observable<CRMTelephoneCountryCode[]> {
    const url = this.getUrl();
    return this.http.get<CRMTelephoneCountryCode[]>(url);
  }

  private getUrl(): string {
    return `${crmEndpoint}/telephoneCountryCodes`;
  }
}
