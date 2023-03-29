import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Tutor } from '@/domain/administrator/tutor';
import type { IHttpService } from '@/services/httpService';

export interface ITutorService {
  getTutorsBySchool: (administratorId: number, schoolId: number) => Observable<Tutor[]>;
}

export class TutorService implements ITutorService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getTutorsBySchool(administratorId: number, schoolId: number): Observable<Tutor[]> {
    const url = `${this.getBaseUrl(administratorId)}/schools/${schoolId}/tutors`;
    return this.httpService.get<Tutor[]>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}`;
  }
}
