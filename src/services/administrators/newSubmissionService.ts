import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/administrator/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/administrator/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/administrator/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/administrator/newUploadSlot';
import type { Tutor } from '@/domain/administrator/tutor';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewTransfer, RawNewTransfer } from '@/domain/newTransfer';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionWithEnrollmentAndCourseAndAssignments = NewSubmission & {
  enrollment: Enrollment & {
    course: Course;
  };
  tutor: Tutor | null;
  newAssignments: Array<NewAssignment & {
    newParts: Array<NewPart & {
      newTextBoxes: NewTextBox[];
      newUploadSlots: NewUploadSlot[];
    }>;
  }>;
  newTransfers: Array<NewTransfer & {
    preTutor: Tutor;
    postTutor: Tutor;
  }>;
};

type RawNewSubmissionWithEnrollmentAndCourseAndAssignments = RawNewSubmission & {
  enrollment: RawEnrollment & {
    course: Course;
  };
  tutor: Tutor | null;
  newAssignments: Array<RawNewAssignment & {
    newParts: Array<RawNewPart & {
      newTextBoxes: RawNewTextBox[];
      newUploadSlots: RawNewUploadSlot[];
    }>;
  }>;
  newTransfers: Array<RawNewTransfer & {
    preTutor: Tutor;
    postTutor: Tutor;
  }>;
};

export type NewTransferWithSubmissionAndTutors = NewTransfer & {
  newSubmission: NewSubmission;
  preTutor: Tutor;
  postTutor: Tutor;
};

type RawNewTransferWithSubmissionAndTutors = RawNewTransfer & {
  newSubmission: RawNewSubmission;
  preTutor: Tutor;
  postTutor: Tutor;
};

export interface INewSubmissionService {
  getSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmissionWithEnrollmentAndCourseAndAssignments>;
  restartSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmission>;
  transferSubmission: (administratorId: number, submissionId: string, tutorId: number) => Observable<NewTransferWithSubmissionAndTutors>;
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

  public transferSubmission(administratorId: number, submissionId: string, tutorId: number): Observable<NewTransferWithSubmissionAndTutors> {
    const url = `${this.getUrl(administratorId)}/${submissionId}/transfers`;
    const body = { tutorId };
    return this.httpService.post<RawNewTransferWithSubmissionAndTutors>(url, body).pipe(
      map(this.mapNewTransferWithSubmissionAndTutors),
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

  private readonly mapNewTransferWithSubmissionAndTutors = (newTransfer: RawNewTransferWithSubmissionAndTutors): NewTransferWithSubmissionAndTutors => {
    return {
      ...newTransfer,
      created: new Date(newTransfer.created),
      newSubmission: {
        ...newTransfer.newSubmission,
        submitted: newTransfer.newSubmission.submitted === null ? null : new Date(newTransfer.newSubmission.submitted),
        transferred: newTransfer.newSubmission.transferred === null ? null : new Date(newTransfer.newSubmission.transferred),
        closed: newTransfer.newSubmission.closed === null ? null : new Date(newTransfer.newSubmission.closed),
        created: new Date(newTransfer.newSubmission.created),
        modified: newTransfer.newSubmission.modified === null ? null : new Date(newTransfer.newSubmission.modified),
      },
    };
  };
}
