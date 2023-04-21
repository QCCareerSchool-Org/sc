import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { T2202Receipt } from '@/domain/t2202Receipt';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type T2202ReceiptWithEnrollmentWithCourse = T2202Receipt & {
  enrollment: Enrollment & {
    course: Course;
  };
};

type RawT2202ReceiptWithEnrollmentWithCourse = T2202Receipt & {
  enrollment: RawEnrollment & {
    course: Course;
  };
};

export interface IT2202ReceiptService {
  getT2202Receipts: (studentId: number) => Observable<T2202ReceiptWithEnrollmentWithCourse[]>;
}

export class T2202ReceiptService implements IT2202ReceiptService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getT2202Receipts(studentId: number): Observable<T2202ReceiptWithEnrollmentWithCourse[]> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawT2202ReceiptWithEnrollmentWithCourse[]>(url).pipe(
      map(t2202Receipts => t2202Receipts.map(this.mapT2202ReceiptWithEnrollmentWithCourse)),
    );
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}/t2202Receipts`;
  }

  private readonly mapT2202ReceiptWithEnrollmentWithCourse = (raw: RawT2202ReceiptWithEnrollmentWithCourse): T2202ReceiptWithEnrollmentWithCourse => {
    return {
      ...raw,
      enrollment: {
        ...raw.enrollment,
        enrollmentDate: raw.enrollment.enrollmentDate === null ? null : new Date(raw.enrollment.enrollmentDate),
      },
    };
  };
}
