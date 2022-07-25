import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { crmEndpoint } from '../../basePath';
import type { CRMCountry } from '@/domain/student/crm/crmCountry';
import type { CRMCourse, RawCRMCourse } from '@/domain/student/crm/crmCourse';
import type { CRMCurrency } from '@/domain/student/crm/crmCurrency';
import type { CRMEnrollment, RawCRMEnrollment } from '@/domain/student/crm/crmEnrollment';
import type { CRMProvince } from '@/domain/student/crm/crmProvince';
import type { CRMStudent, RawCRMStudent } from '@/domain/student/crm/crmStudent';
import type { IHttpService } from '@/services/httpService';

export type CRMStudentPayload = CRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
  enrollments: Array<CRMEnrollment & { course: CRMCourse; currency: CRMCurrency }>;
};

type RawCRMStudentPayload = RawCRMStudent & {
  province: CRMProvince | null;
  country: CRMCountry;
  enrollments: Array<RawCRMEnrollment & { course: RawCRMCourse; currency: CRMCurrency }>;
};

export interface ICRMStudentService {
  getCRMStudent: (studentId: number) => Observable<CRMStudentPayload>;
}

export class CRMStudentService implements ICRMStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCRMStudent(studentId: number): Observable<CRMStudentPayload> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawCRMStudentPayload>(url).pipe(
      map(this.mapCrmStudent),
    );
  }

  private getUrl(studentId: number): string {
    return `${crmEndpoint}/students/${studentId}`;
  }

  private readonly mapCrmStudent = (raw: RawCRMStudentPayload): CRMStudentPayload => ({
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
    })),
  });
}
