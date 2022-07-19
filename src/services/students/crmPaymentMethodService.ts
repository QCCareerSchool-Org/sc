import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { crmEndpoint } from '../../basePath';
import type { CRMPaymentMethod, RawCRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { IHttpService } from '@/services/httpService';

export interface ICRMPaymentMethodService {
  addCRMPaymentMethod: (studentId: number, enrollmentId: number, updateAll: boolean, paymentToken: string) => Observable<CRMPaymentMethod>;
}

export class CRMPaymentMethodService implements ICRMPaymentMethodService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addCRMPaymentMethod(studentId: number, enrollmentId: number, updateAll: boolean, paymentToken: string): Observable<CRMPaymentMethod> {
    const url = this.getUrl(studentId, enrollmentId);
    const body = {
      updateAll,
      paymentToken,
    };
    return this.httpService.post<RawCRMPaymentMethod>(url, body).pipe(
      map(this.mapCRMPaymentMethod),
    );
  }

  private getUrl(studentId: number, enrollmentId: number): string {
    return `${crmEndpoint}/students/${studentId}/enrollments/${enrollmentId}/paymentMethods`;
  }

  private readonly mapCRMPaymentMethod = (raw: RawCRMPaymentMethod): CRMPaymentMethod => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });
}
