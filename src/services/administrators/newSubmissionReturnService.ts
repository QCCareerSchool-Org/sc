import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewSubmission, RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { AdministratorStudent, RawAdministratorStudent } from '@/domain/administrator/student';
import type { AdministratorTutor } from '@/domain/administrator/tutor';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewSubmissionReturn, RawNewSubmissionReturn } from '@/domain/newSubmissionReturn';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionReturnWithSubmissionWithTutorAndEnrollment = NewSubmissionReturn & {
  newSubmission: NewSubmission & {
    tutor: AdministratorTutor;
    enrollment: Enrollment & {
      course: Course;
      student: AdministratorStudent;
    };
  };
};

type RawNewSubmissionReturnWithSubmissionWithTutorAndEnrollment = RawNewSubmissionReturn & {
  newSubmission: RawNewSubmission & {
    tutor: AdministratorTutor;
    enrollment: RawEnrollment & {
      course: Course;
      student: RawAdministratorStudent;
    };
  };
};

export type NewSubmissionReturnWithSubmission = NewSubmissionReturn & {
  newSubmission: Omit<NewSubmission, 'points' | 'mark' | 'complete'>;
};

type RawNewSubmissionReturnWithSubmission = RawNewSubmissionReturn & {
  newSubmission: Omit<RawNewSubmission, 'points' | 'mark' | 'complete'>;
};

export interface INewSubmissionReturnService {
  getSubmissionReturn: (administratorId: number, submissionReturnId: string) => Observable<NewSubmissionReturnWithSubmissionWithTutorAndEnrollment>;
  closeSubmissionReturn: (administratorId: number, submissionReturnId: string, adminComment: string) => Observable<NewSubmissionReturnWithSubmission>;
}

export class NewSubmissionReturnService implements INewSubmissionReturnService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getSubmissionReturn(administratorId: number, submissionReturnId: string): Observable<NewSubmissionReturnWithSubmissionWithTutorAndEnrollment> {
    const url = `${this.getUrl(administratorId)}/${submissionReturnId}`;
    return this.httpService.get<RawNewSubmissionReturnWithSubmissionWithTutorAndEnrollment>(url).pipe(
      map(this.mapNewUnitReturnWithSubmissionWithTutorAndEnrollment),
    );
  }

  public closeSubmissionReturn(administratorId: number, submissionReturnId: string, adminComment: string): Observable<NewSubmissionReturnWithSubmission> {
    const url = `${this.getUrl(administratorId)}/${submissionReturnId}`;
    return this.httpService.put<RawNewSubmissionReturnWithSubmission>(url, { adminComment }).pipe(
      map(this.mapNewUnitReturnWithSubmission),
    );
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newSubmissionReturns`;
  }

  private readonly mapNewUnitReturnWithSubmission = (raw: RawNewSubmissionReturnWithSubmission): NewSubmissionReturnWithSubmission => {
    return {
      ...raw,
      returned: new Date(raw.returned),
      completed: raw.completed === null ? null : new Date(raw.completed),
      newSubmission: {
        ...raw.newSubmission,
        submitted: raw.newSubmission.submitted === null ? null : new Date(raw.newSubmission.submitted),
        transferred: raw.newSubmission.transferred === null ? null : new Date(raw.newSubmission.transferred),
        closed: raw.newSubmission.closed === null ? null : new Date(raw.newSubmission.closed),
        created: new Date(raw.newSubmission.created),
        modified: raw.newSubmission.modified === null ? null : new Date(raw.newSubmission.modified),
      },
    };
  };

  private readonly mapNewUnitReturnWithSubmissionWithTutorAndEnrollment = (raw: RawNewSubmissionReturnWithSubmissionWithTutorAndEnrollment): NewSubmissionReturnWithSubmissionWithTutorAndEnrollment => {
    return {
      ...raw,
      returned: new Date(raw.returned),
      completed: raw.completed === null ? null : new Date(raw.completed),
      newSubmission: {
        ...raw.newSubmission,
        submitted: raw.newSubmission.submitted === null ? null : new Date(raw.newSubmission.submitted),
        transferred: raw.newSubmission.transferred === null ? null : new Date(raw.newSubmission.transferred),
        closed: raw.newSubmission.closed === null ? null : new Date(raw.newSubmission.closed),
        created: new Date(raw.newSubmission.created),
        modified: raw.newSubmission.modified === null ? null : new Date(raw.newSubmission.modified),
        enrollment: {
          ...raw.newSubmission.enrollment,
          enrollmentDate: raw.newSubmission.enrollment.enrollmentDate === null ? null : new Date(raw.newSubmission.enrollment.enrollmentDate),
          student: {
            ...raw.newSubmission.enrollment.student,
            lastLogin: raw.newSubmission.enrollment.student.lastLogin === null ? null : new Date(raw.newSubmission.enrollment.student.lastLogin),
            expiry: raw.newSubmission.enrollment.student.expiry === null ? null : new Date(raw.newSubmission.enrollment.student.expiry),
            created: new Date(raw.newSubmission.enrollment.student.created),
            modified: new Date(raw.newSubmission.enrollment.student.modified),
          },
        },
      },
    };
  };
}
