import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { AdministratorStudent, RawAdministratorStudent } from '@/domain/administrator/student';
import type { AdministratorTutor } from '@/domain/administrator/tutor';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { NewUnitReturn, RawNewUnitReturn } from '@/domain/newUnitReturn';
import type { IHttpService } from '@/services/httpService';

export type NewUnitReturnWithUnitWithTutorAndEnrollment = NewUnitReturn & {
  newUnit: NewUnit & {
    tutor: AdministratorTutor;
    enrollment: Enrollment & {
      course: Course;
      student: AdministratorStudent;
    };
  };
};

type RawNewUnitReturnWithUnitWithTutorAndEnrollment = RawNewUnitReturn & {
  newUnit: RawNewUnit & {
    tutor: AdministratorTutor;
    enrollment: RawEnrollment & {
      course: Course;
      student: RawAdministratorStudent;
    };
  };
};

export interface INewUnitReturnService {
  getUnitReturn: (administratorId: number, unitReturnId: string) => Observable<NewUnitReturnWithUnitWithTutorAndEnrollment>;
}

export class NewUnitReturnService implements INewUnitReturnService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnitReturn(administratorId: number, unitReturnId: string): Observable<NewUnitReturnWithUnitWithTutorAndEnrollment> {
    const url = `${this.getUrl(administratorId)}/${unitReturnId}`;
    return this.httpService.get<RawNewUnitReturnWithUnitWithTutorAndEnrollment>(url).pipe(
      map(this.mapNewUnitReturnWithUnit),
    );
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newUnitReturns`;
  }

  private readonly mapNewUnitReturnWithUnit = (raw: RawNewUnitReturnWithUnitWithTutorAndEnrollment): NewUnitReturnWithUnitWithTutorAndEnrollment => {
    return {
      ...raw,
      returned: new Date(raw.returned),
      completed: raw.completed === null ? null : new Date(raw.completed),
      newUnit: {
        ...raw.newUnit,
        submitted: raw.newUnit.submitted === null ? null : new Date(raw.newUnit.submitted),
        transferred: raw.newUnit.transferred === null ? null : new Date(raw.newUnit.transferred),
        closed: raw.newUnit.closed === null ? null : new Date(raw.newUnit.closed),
        created: new Date(raw.newUnit.created),
        modified: raw.newUnit.modified === null ? null : new Date(raw.newUnit.modified),
        enrollment: {
          ...raw.newUnit.enrollment,
          enrollmentDate: raw.newUnit.enrollment.enrollmentDate === null ? null : new Date(raw.newUnit.enrollment.enrollmentDate),
          student: {
            ...raw.newUnit.enrollment.student,
            lastLogin: raw.newUnit.enrollment.student.lastLogin === null ? null : new Date(raw.newUnit.enrollment.student.lastLogin),
            expiry: raw.newUnit.enrollment.student.expiry === null ? null : new Date(raw.newUnit.enrollment.student.expiry),
            creationDate: new Date(raw.newUnit.enrollment.student.creationDate),
            timestamp: new Date(raw.newUnit.enrollment.student.timestamp),
          },
        },
      },
    };
  };
}
