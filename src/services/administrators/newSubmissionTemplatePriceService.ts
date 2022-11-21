import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { IHttpService } from '../httpService';
import type { NewSubmissionTemplatePrice, RawNewSubmissionTemplatePrice } from '@/domain/newSubmissionTemplatePrice';
import { endpoint } from 'src/basePath';

export type NewSubmissionTemplatePricePayload = Array<{
  submissionTemplateId: string;
  price: number;
  currencyId: number;
}>;

export interface INewSubmissionTemplatePriceService {
  getPrices: (administratorId: number, courseId: number, countryId: number | null) => Observable<NewSubmissionTemplatePrice[]>;
  replacePrices: (administratorId: number, courseId: number, countryId: number | null, payload: NewSubmissionTemplatePricePayload) => Observable<void>;
  deletePrices: (administratorId: number, courseId: number, countryId: number | null) => Observable<void>;
}

export class NewSubmissionTemplatePriceService implements INewSubmissionTemplatePriceService {
  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getPrices(administratorId: number, courseId: number, countryId: number | null): Observable<NewSubmissionTemplatePrice[]> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.get<RawNewSubmissionTemplatePrice[]>(url)
      .pipe(map(this.mapNewSubmissionTemplatePrices));
  }

  public replacePrices(administratorId: number, courseId: number, countryId: number | null, payload: NewSubmissionTemplatePricePayload): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.put<void>(url, { priceData: payload });
  }

  public deletePrices(administratorId: number, courseId: number, countryId: number | null): Observable<void> {
    const url = this.getBaseUrl(administratorId, courseId, countryId);
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, courseId: number, countryId: number | null): string {
    const url = `${endpoint}/administrators/${administratorId}/courses/${courseId}/newSubmissionTemplatePrices`;
    return countryId === null ? url : `${url}?countryId=${encodeURIComponent(countryId)}`;
  }

  private readonly mapNewSubmissionTemplatePrices = (raw: RawNewSubmissionTemplatePrice[]): NewSubmissionTemplatePrice[] => {
    return raw.map(r => ({
      ...r,
      created: new Date(r.created),
      modified: r.modified === null ? null : new Date(r.modified),
    }));
  };
}
