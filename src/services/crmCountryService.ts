import type { Observable } from 'rxjs';

import type { CRMCountry } from '@/domain/crm/crmCountry';
import type { IHttpService } from '@/services/httpService';
import { crmEndpoint } from 'src/basePath';

export interface ICRMCountryService {
  getAllCRMCountries: () => Observable<CRMCountry[]>;
}

export class CRMCountryService implements ICRMCountryService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllCRMCountries(): Observable<CRMCountry[]> {
    const url = this.getUrl();
    return this.httpService.get<CRMCountry[]>(url);
  }

  private getUrl(): string {
    return `${crmEndpoint}/countries`;
  }
}
