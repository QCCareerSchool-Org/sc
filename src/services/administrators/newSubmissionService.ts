import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/administrator/newAssignment';
import type { NewSubmission, RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { Course } from '@/domain/course';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionWithCourseAndAssignments = NewSubmission & {
  course: Course;
  newAssignments: NewAssignment[];
};

type RawNewSubmissionWithCourseAndAssignments = RawNewSubmission & {
  course: Course;
  newAssignments: RawNewAssignment[];
};

export interface INewSubmissionService {
  getSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmissionWithCourseAndAssignments>;
  restartSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmission>;
}

export class NewSubmissionService implements INewSubmissionService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getSubmission(administratorId: number, submissionId: string): Observable<NewSubmissionWithCourseAndAssignments> {
    const url = `${this.getUrl(administratorId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionWithCourseAndAssignments>(url).pipe(
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

  private readonly mapNewSubmissionWithCourseAndAssignments = (newSubmission: RawNewSubmissionWithCourseAndAssignments): NewSubmissionWithCourseAndAssignments => {
    return {
      ...newSubmission,
      submitted: newSubmission.submitted === null ? null : new Date(newSubmission.submitted),
      transferred: newSubmission.transferred === null ? null : new Date(newSubmission.transferred),
      closed: newSubmission.closed === null ? null : new Date(newSubmission.closed),
      created: new Date(newSubmission.created),
      modified: newSubmission.modified === null ? null : new Date(newSubmission.modified),
      newAssignments: newSubmission.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  };
}
