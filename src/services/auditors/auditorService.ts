import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Auditor, RawAuditor } from '@/domain/auditor/auditor';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export interface IAuditorService {
  getAuditor: (auditorId: number) => Observable<Auditor>;
  updateEmailAddress: (auditorId: number, emailAddress: string, password: string) => Observable<void>;
  updatePassword: (auditorId: number, newPassword: string, newPasswordRepeat: string, password: string) => Observable<void>;
}

export class AuditorService implements IAuditorService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAuditor(auditorId: number): Observable<Auditor> {
    const url = this.getBaseUrl(auditorId);
    return this.httpService.get<RawAuditor>(url).pipe(
      map(this.mapAuditor),
    );
  }

  public updateEmailAddress(auditorId: number, emailAddress: string, password: string): Observable<void> {
    const url = `${this.getBaseUrl(auditorId)}/emailAddress`;
    const body = { emailAddress, password };
    return this.httpService.post<void>(url, body);
  }

  public updatePassword(auditorId: number, newPassword: string, newPasswordRepeat: string, password: string): Observable<void> {
    const url = `${this.getBaseUrl(auditorId)}/password`;
    const body = { newPassword, newPasswordRepeat, password };
    return this.httpService.post<void>(url, body);
  }

  private getBaseUrl(auditorId: number): string {
    return `${endpoint}/auditors/${auditorId}`;
  }

  private readonly mapAuditor = (raw: RawAuditor): Auditor => {
    return {
      ...raw,
      created: new Date(raw.created),
      modified: raw.modified === null ? null : new Date(raw.modified),
    };
  };
}
