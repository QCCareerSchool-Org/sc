import qs from 'querystring';
import { map, type Observable } from 'rxjs';

import type { Award } from '@/domain/award';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface IAwardService {
  getAllAwards: (administratorId: number, startDate: Date, endDate: Date) => Observable<Award[]>;
}

export class AwardService implements IAwardService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAllAwards(administratorId: number, startDate: Date, endDate: Date): Observable<Award[]> {
    const url = this.getBaseUrl(administratorId) + '?' + qs.stringify({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    return this.httpService.get<Award[]>(url).pipe(
      map(awards => awards.map(a => ({
        ...a,
        created: new Date(a.created),
      }))),
    );
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/awardsOfExcellence`;
  }
}
