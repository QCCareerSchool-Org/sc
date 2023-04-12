import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { CRMEnrollment, RawCRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMPaymentMethod, RawCRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { CRMTransaction, RawCRMTransaction } from '@/domain/student/crm/crmTransaction';
import type { IHttpService } from '@/services/httpService';
import { crmEndpoint } from 'src/basePath';

type ChargeResult = CRMTransaction & { paymentMethod: CRMPaymentMethod; enrollment: CRMEnrollment };

type RawChargeResult = RawCRMTransaction & { paymentMethod: RawCRMPaymentMethod; enrollment: RawCRMEnrollment };

export interface ICRMPaymentMethodService {
  addCRMPaymentMethod: (studentId: number, enrollmentIds: number[], company: string, singleUseToken: string) => Observable<CRMPaymentMethod>;
  chargeCRMPaymentMethod: (studentId: number, enrollmentId: number, paymentMethodId: number, amount: number) => Observable<ChargeResult>;
}

export class CRMPaymentMethodService implements ICRMPaymentMethodService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addCRMPaymentMethod(studentId: number, enrollmentIds: number[], company: string, singleUseToken: string): Observable<CRMPaymentMethod> {
    const url = `${crmEndpoint}/students/${studentId}/paymentMethods`; // send the enrollmentIds in the body
    const body = { enrollmentIds, company, singleUseToken };
    return this.httpService.post<RawCRMPaymentMethod>(url, body).pipe(
      map(this.mapCRMPaymentMethod),
    );
  }

  public chargeCRMPaymentMethod(studentId: number, enrollmentId: number, paymentMethodId: number, amount: number): Observable<ChargeResult> {
    const url = `${this.getUrl(studentId, enrollmentId)}/${paymentMethodId}`;
    const body = { amount };
    return this.httpService.post<RawChargeResult>(url, body).pipe(
      map(this.mapChargeResult),
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

  private readonly mapChargeResult = (raw: RawChargeResult): ChargeResult => ({
    ...raw,
    transactionDateTime: new Date(raw.transactionDateTime),
    postedDate: raw.postedDate === null ? null : new Date(raw.postedDate),
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    paymentMethod: {
      ...raw.paymentMethod,
      created: new Date(raw.paymentMethod.created),
      modified: raw.paymentMethod.modified === null ? null : new Date(raw.paymentMethod.modified),
    },
    enrollment: {
      ...raw.enrollment,
      enrollmentDate: raw.enrollment.enrollmentDate === null ? null : new Date(raw.enrollment.enrollmentDate),
      expiryDate: raw.enrollment.expiryDate === null ? null : new Date(raw.enrollment.expiryDate),
      statusDate: raw.enrollment.statusDate === null ? null : new Date(raw.enrollment.statusDate),
      gradEmailDate: raw.enrollment.gradEmailDate === null ? null : new Date(raw.enrollment.gradEmailDate),
      paymentStart: raw.enrollment.paymentStart === null ? null : new Date(raw.enrollment.paymentStart),
      preparedDate: raw.enrollment.preparedDate === null ? null : new Date(raw.enrollment.preparedDate),
      shippedDate: raw.enrollment.shippedDate === null ? null : new Date(raw.enrollment.shippedDate),
      diplomaDate: raw.enrollment.diplomaDate === null ? null : new Date(raw.enrollment.diplomaDate),
      created: new Date(raw.enrollment.created),
      modified: raw.enrollment.modified === null ? null : new Date(raw.enrollment.modified),
    },
  });
}
