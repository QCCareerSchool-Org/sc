import type { Observable } from 'rxjs';

import type { Currency } from '@/domain/currency';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface ICurrencyService {
  getAllCurrencies: (administratorId: number) => Observable<Currency[]>;
}

export class CurrencyService implements ICurrencyService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllCurrencies(administratorId: number): Observable<Currency[]> {
    const url = `${endpoint}/administrators/${administratorId}/currencies`;
    return this.httpService.get<Currency[]>(url);
  }
}
