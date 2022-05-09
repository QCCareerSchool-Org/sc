import type { Observable } from 'rxjs';
import type { IHttpService } from '../httpService';
import { endpoint } from 'src/basePath';

export type NewUnitPricePayload = Array<{
  unitTemplateId: string;
  price: number;
  currencyId: number;
}>;

export interface INewUnitPriceService {
  getPrices: (administratorId: number, courseId: number, countryId: number | null) => Observable<void>;
  replacePrices: (administratorId: number, courseId: number, countryId: number | null, payload: NewUnitPricePayload) => Observable<void>;
}

export class NewUnitPriceService {
  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getPrices(administratorId: number, courseId: number, countryId: number | null): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.get<void>(url);
  }

  public replacePrices(administratorId: number, courseId: number, countryId: number | null, payload: NewUnitPricePayload): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.post<void>(url, { prices: payload });
  }

  private getBaseUrl(administratorId: number, courseId: number, countryId: number | null): string {
    const url = `${endpoint}/administrators/${administratorId}/courses/${courseId}/newUnitPrices`;
    return countryId === null ? url : `${url}?countryId=${encodeURIComponent(countryId)}`;
  }
}
