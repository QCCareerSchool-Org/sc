import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { crmEndpoint } from '../../basePath';
import type { CRMCourse, RawCRMCourse } from '@/domain/student/crm/crmCourse';
import type { CRMCurrency } from '@/domain/student/crm/crmCurrency';
import type { CRMEnrollment, RawCRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMPaymentMethod, RawCRMPaymentMethod } from '@/domain/student/crm/crmPaymentMethod';
import type { CRMTransaction, RawCRMTransaction } from '@/domain/student/crm/crmTransaction';
import type { IHttpService } from '@/services/httpService';

export type CRMEnrollmentWithCourse = CRMEnrollment & {
  course: CRMCourse;
  currency: CRMCurrency;
  transactions: Array<CRMTransaction & {
    paymentMethod: CRMPaymentMethod | null;
  }>;
  paymentMethods: CRMPaymentMethod[];
};

type RawCRMEnrollmentWithCourse = RawCRMEnrollment & {
  course: RawCRMCourse;
  currency: CRMCurrency;
  transactions: Array<RawCRMTransaction & {
    paymentMethod: RawCRMPaymentMethod | null;
  }>;
  paymentMethods: RawCRMPaymentMethod[];
};

export interface ICRMEnrollmentService {
  getCRMEnrollment: (studentId: number, enrollmentId: number) => Observable<CRMEnrollmentWithCourse>;
}

export class CRMEnrollmentService implements ICRMEnrollmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCRMEnrollment(studentId: number, enrollmentId: number): Observable<CRMEnrollmentWithCourse> {
    const url = `${this.getUrl(studentId)}/${enrollmentId}`;
    return this.httpService.get<RawCRMEnrollmentWithCourse>(url).pipe(
      map(this.mapCrmEnrollmentWithCourse),
    );
  }

  private getUrl(studentId: number): string {
    return `${crmEndpoint}/students/${studentId}/enrollments`;
  }

  private readonly mapCrmEnrollmentWithCourse = (raw: RawCRMEnrollmentWithCourse): CRMEnrollmentWithCourse => ({
    ...raw,
    enrollmentDate: raw.enrollmentDate === null ? null : new Date(raw.enrollmentDate),
    expiryDate: raw.expiryDate === null ? null : new Date(raw.expiryDate),
    statusDate: raw.statusDate === null ? null : new Date(raw.statusDate),
    gradEmailDate: raw.gradEmailDate === null ? null : new Date(raw.gradEmailDate),
    paymentStart: raw.paymentStart === null ? null : new Date(raw.paymentStart),
    preparedDate: raw.preparedDate === null ? null : new Date(raw.preparedDate),
    shippedDate: raw.shippedDate === null ? null : new Date(raw.shippedDate),
    diplomaDate: raw.diplomaDate === null ? null : new Date(raw.diplomaDate),
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    course: {
      ...raw.course,
      created: new Date(raw.course.created),
      modified: raw.course.modified === null ? null : new Date(raw.course.modified),
    },
    transactions: raw.transactions.map(t => ({
      ...t,
      transactionDateTime: new Date(t.transactionDateTime),
      postedDate: t.postedDate === null ? null : new Date(t.postedDate),
      created: new Date(t.created),
      modified: t.modified === null ? null : new Date(t.modified),
      paymentMethod: t.paymentMethod === null ? null : {
        ...t.paymentMethod,
        created: new Date(t.paymentMethod.created),
        modified: t.paymentMethod.modified === null ? null : new Date(t.paymentMethod.modified),
      },
    })),
    paymentMethods: raw.paymentMethods.map(p => ({
      ...p,
      created: new Date(p.created),
      modified: p.modified === null ? null : new Date(p.modified),
    })),
  });
}
