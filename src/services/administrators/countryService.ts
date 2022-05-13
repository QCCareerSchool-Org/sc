import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Country } from '@/domain/country';
import type { IHttpService } from '@/services/httpService';

export interface ICountryService {
  getAllCountries: (administratorId: number) => Observable<Country[]>;
  getCountry: (administratorId: number, countryId: number) => Observable<Country>;
}

export class CountryService implements ICountryService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllCountries(administratorId: number): Observable<Country[]> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.get<Country[]>(url);
  }

  public getCountry(administratorId: number, countryId: number): Observable<Country> {
    const url = `${this.getBaseUrl(administratorId)}/${countryId}`;
    return this.httpService.get<Country>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/countries`;
  }
}
