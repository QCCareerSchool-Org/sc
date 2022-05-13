import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { IHttpService } from '../httpService';
import type { NewUnitTemplatePrice, RawNewUnitTemplatePrice } from '@/domain/newUnitTemplatePrice';
import { endpoint } from 'src/basePath';

export type NewUnitTemplatePricePayload = Array<{
  unitTemplateId: string;
  price: number;
  currencyId: number;
}>;

export interface INewUnitTemplatePriceService {
  getPrices: (administratorId: number, courseId: number, countryId: number | null) => Observable<NewUnitTemplatePrice[]>;
  replacePrices: (administratorId: number, courseId: number, countryId: number | null, payload: NewUnitTemplatePricePayload) => Observable<void>;
  deletePrices: (administratorId: number, courseId: number, countryId: number | null) => Observable<void>;
}

export class NewUnitTemplatePriceService implements INewUnitTemplatePriceService {
  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getPrices(administratorId: number, courseId: number, countryId: number | null): Observable<NewUnitTemplatePrice[]> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.get<RawNewUnitTemplatePrice[]>(url)
      .pipe(map(this.mapNewUnitTemplatePrices));
  }

  public replacePrices(administratorId: number, courseId: number, countryId: number | null, payload: NewUnitTemplatePricePayload): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.put<void>(url, { priceData: payload });
  }

  public deletePrices(administratorId: number, courseId: number, countryId: number | null): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, courseId: number, countryId: number | null): string {
    const url = `${endpoint}/administrators/${administratorId}/courses/${courseId}/newUnitTemplatePrices`;
    return countryId === null ? url : `${url}?countryId=${encodeURIComponent(countryId)}`;
  }

  private readonly mapNewUnitTemplatePrices = (raw: RawNewUnitTemplatePrice[]): NewUnitTemplatePrice[] => {
    return raw.map(r => ({
      ...r,
      created: new Date(r.created),
      modified: r.modified === null ? null : new Date(r.modified),
    }));
  };
}
