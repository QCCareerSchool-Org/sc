import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Country } from '@/domain/country';
import type { IHttpService } from '@/services/httpService';

export interface ICountryService {
  getAllCountries: (administratorId: number) => Observable<Country[]>;
}

export class CountryService implements ICountryService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllCountries(administratorId: number): Observable<Country[]> {
    const url = `${endpoint}/administrators/${administratorId}/countries`;
    return this.httpService.get<Country[]>(url);
  }
}
