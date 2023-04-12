import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { CRMCountry } from '@/domain/crm/crmCountry';
import type { CRMProvince } from '@/domain/crm/crmProvince';
import type { CRMCourse, RawCRMCourse } from '@/domain/student/crm/crmCourse';
import type { CRMCurrency, RawCRMCurrency } from '@/domain/student/crm/crmCurrency';
import type { CRMEnrollment, RawCRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMStudent, RawCRMStudent } from '@/domain/student/crm/crmStudent';
import type { CRMTransaction, RawCRMTransaction } from '@/domain/student/crm/crmTransaction';
import type { IHttpService } from '@/services/httpService';
import { crmEndpoint } from 'src/basePath';

export type CRMStudentWithCountryProvinceAndEnrollments = CRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
  enrollments: Array<CRMEnrollment & { course: CRMCourse; currency: CRMCurrency; transactions: CRMTransaction[] }>;
};

type RawCRMStudentWithCountryProvinceAndEnrollments = RawCRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
  enrollments: Array<RawCRMEnrollment & { course: RawCRMCourse; currency: RawCRMCurrency; transactions: RawCRMTransaction[] }>;
};

export type CRMStudentWithCountryAndProvince = CRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
};

type RawCRMStudentWithCountryAndProvince = RawCRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
};

export interface ICRMStudentService {
  getCRMStudent: (studentId: number) => Observable<CRMStudentWithCountryProvinceAndEnrollments>;
  updateTelephoneNumber: (studentId: number, telephoneCountryCode: number, telephoneNumber: string) => Observable<CRMStudent>;
  updateEmailAddress: (studentId: number, emailAddress: string) => Observable<CRMStudent>;
  updateBillingAddress: (
    studentId: number,
    address1: string,
    address2: string,
    city: string,
    provinceCode: string,
    postalCode: string,
    countryCode: string,
  ) => Observable<CRMStudentWithCountryAndProvince>;
}

export class CRMStudentService implements ICRMStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCRMStudent(studentId: number): Observable<CRMStudentWithCountryProvinceAndEnrollments> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawCRMStudentWithCountryProvinceAndEnrollments>(url).pipe(
      map(this.mapCrmStudentWithCountryProvinceAndEnrollments),
    );
  }

  public updateTelephoneNumber(studentId: number, telephoneCountryCode: number, telephoneNumber: string): Observable<CRMStudent> {
    const url = `${this.getUrl(studentId)}/telephoneNumber`;
    const body = {
      telephoneCountryCode,
      telephoneNumber,
    };
    return this.httpService.put<RawCRMStudent>(url, body).pipe(
      map(this.mapCrmStudent),
    );
  }

  public updateEmailAddress(studentId: number, emailAddress: string): Observable<CRMStudent> {
    const url = `${this.getUrl(studentId)}/emailAddress`;
    const body = { emailAddress };
    return this.httpService.put<RawCRMStudent>(url, body).pipe(
      map(this.mapCrmStudent),
    );
  }

  public updateBillingAddress(
    studentId: number,
    address1: string,
    address2: string,
    city: string,
    provinceCode: string,
    postalCode: string,
    countryCode: string,
  ): Observable<CRMStudentWithCountryAndProvince> {
    const url = `${this.getUrl(studentId)}/billingAddress`;
    const body = { address1, address2, city, provinceCode, postalCode, countryCode };
    return this.httpService.put<RawCRMStudentWithCountryAndProvince>(url, body).pipe(
      map(this.mapCrmStudentWithCountryAndProvince),
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

  private readonly mapCrmStudentWithCountryAndProvince = (raw: RawCRMStudentWithCountryAndProvince): CRMStudentWithCountryAndProvince => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });

  private readonly mapCrmStudentWithCountryProvinceAndEnrollments = (raw: RawCRMStudentWithCountryProvinceAndEnrollments): CRMStudentWithCountryProvinceAndEnrollments => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    enrollments: raw.enrollments.map(e => ({
      ...e,
      enrollmentDate: e.enrollmentDate === null ? null : new Date(e.enrollmentDate),
      expiryDate: e.expiryDate === null ? null : new Date(e.expiryDate),
      statusDate: e.statusDate === null ? null : new Date(e.statusDate),
      gradEmailDate: e.gradEmailDate === null ? null : new Date(e.gradEmailDate),
      paymentStart: e.paymentStart === null ? null : new Date(e.paymentStart),
      preparedDate: e.preparedDate === null ? null : new Date(e.preparedDate),
      shippedDate: e.shippedDate === null ? null : new Date(e.shippedDate),
      diplomaDate: e.diplomaDate === null ? null : new Date(e.diplomaDate),
      created: new Date(raw.created),
      modified: raw.modified === null ? null : new Date(raw.modified),
      course: {
        ...e.course,
        created: new Date(e.course.created),
        modified: e.course.modified === null ? null : new Date(e.course.modified),
      },
      currency: {
        ...e.currency,
        created: new Date(e.currency.created),
        modified: e.currency.modified === null ? null : new Date(e.currency.modified),
      },
      transactions: e.transactions.map(t => ({
        ...t,
        transactionDateTime: new Date(t.transactionDateTime),
        postedDate: t.postedDate === null ? null : new Date(t.postedDate),
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
    })),
  });
}
