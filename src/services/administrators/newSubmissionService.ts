import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/administrator/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/administrator/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/administrator/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/administrator/newUploadSlot';
import type { AdministratorTutor } from '@/domain/administrator/tutor';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewTransfer, RawNewTransfer } from '@/domain/newTransfer';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionWithEnrollmentAndCourseAndAssignments = NewSubmission & {
  enrollment: Enrollment & {
    course: Course;
  };
  newAssignments: Array<NewAssignment & {
    newParts: Array<NewPart & {
      newTextBoxes: NewTextBox[];
      newUploadSlots: NewUploadSlot[];
    }>;
  }>;
  newTransfers: Array<NewTransfer & {
    preTutor: AdministratorTutor;
    postTutor: AdministratorTutor;
  }>;
};

type RawNewSubmissionWithEnrollmentAndCourseAndAssignments = RawNewSubmission & {
  enrollment: RawEnrollment & {
    course: Course;
  };
  newAssignments: Array<RawNewAssignment & {
    newParts: Array<RawNewPart & {
      newTextBoxes: RawNewTextBox[];
      newUploadSlots: RawNewUploadSlot[];
    }>;
  }>;
  newTransfers: Array<RawNewTransfer & {
    preTutor: AdministratorTutor;
    postTutor: AdministratorTutor;
  }>;
};

export interface INewSubmissionService {
  getSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmissionWithEnrollmentAndCourseAndAssignments>;
  restartSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmission>;
}

export class NewSubmissionService implements INewSubmissionService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getSubmission(administratorId: number, submissionId: string): Observable<NewSubmissionWithEnrollmentAndCourseAndAssignments> {
    const url = `${this.getUrl(administratorId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionWithEnrollmentAndCourseAndAssignments>(url).pipe(
      map(this.mapNewSubmissionWithCourseAndAssignments),
    );
  }

  public restartSubmission(administratorId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getUrl(administratorId)}/${submissionId}/restarts`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewSubmission),
    );
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newSubmissions`;
  }

  private readonly mapNewSubmission = (newSubmission: RawNewSubmission): NewSubmission => {
    return {
      ...newSubmission,
      submitted: newSubmission.submitted === null ? null : new Date(newSubmission.submitted),
      transferred: newSubmission.transferred === null ? null : new Date(newSubmission.transferred),
      closed: newSubmission.closed === null ? null : new Date(newSubmission.closed),
      created: new Date(newSubmission.created),
      modified: newSubmission.modified === null ? null : new Date(newSubmission.modified),
    };
  };

  private readonly mapNewSubmissionWithCourseAndAssignments = (newSubmission: RawNewSubmissionWithEnrollmentAndCourseAndAssignments): NewSubmissionWithEnrollmentAndCourseAndAssignments => {
    return {
      ...newSubmission,
      submitted: newSubmission.submitted === null ? null : new Date(newSubmission.submitted),
      transferred: newSubmission.transferred === null ? null : new Date(newSubmission.transferred),
      closed: newSubmission.closed === null ? null : new Date(newSubmission.closed),
      created: new Date(newSubmission.created),
      modified: newSubmission.modified === null ? null : new Date(newSubmission.modified),
      enrollment: {
        ...newSubmission.enrollment,
        enrollmentDate: newSubmission.enrollment.enrollmentDate === null ? null : new Date(newSubmission.enrollment.enrollmentDate),
      },
      newAssignments: newSubmission.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
        newParts: a.newParts.map(p => ({
          ...p,
          created: new Date(p.created),
          modified: p.modified === null ? null : new Date(p.modified),
          newTextBoxes: p.newTextBoxes.map(t => ({
            ...t,
            created: new Date(t.created),
            modified: t.modified === null ? null : new Date(t.modified),
          })),
          newUploadSlots: p.newUploadSlots.map(u => ({
            ...u,
            created: new Date(u.created),
            modified: u.modified === null ? null : new Date(u.modified),
          })),
        })),
      })),
      newTransfers: newSubmission.newTransfers.map(t => ({
        ...t,
        created: new Date(t.created),
      })),
    };
  };
}
