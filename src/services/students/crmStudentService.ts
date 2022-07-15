import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { crmEndpoint } from '../../basePath';
import type { CRMStudent, RawCRMStudent } from '@/domain/student/crm/crmStudent';
import type { IHttpService } from '@/services/httpService';

export interface ICRMStudentService {
  getCRMStudent: (studentId: number) => Observable<CRMStudent>;
}

export class CRMStudentService implements ICRMStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCRMStudent(studentId: number): Observable<CRMStudent> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawCRMStudent>(url).pipe(
      map(this.mapCrmStudent),
    );
  }

  private getUrl(studentId: number): string {
    return `${crmEndpoint}/students/${studentId}`;
  }

  private readonly mapCrmStudent = (raw: RawCRMStudent): CRMStudent => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });
}
