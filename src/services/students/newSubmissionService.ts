import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/student/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/student/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/student/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/student/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/student/newUploadSlot';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionWithCourseAndChildren = NewSubmission & {
  enrollment: Enrollment;
  newAssignments: Array<NewAssignment & {
    newParts: Array<NewPart & {
      newTextBoxes: NewTextBox[];
      newUploadSlots: NewUploadSlot[];
    }>;
  }>;
};

type RawNewSubmissionWithCourseAndChildren = RawNewSubmission & {
  enrollment: RawEnrollment;
  newAssignments: Array<RawNewAssignment & {
    newParts: Array<RawNewPart & {
      newTextBoxes: RawNewTextBox[];
      newUploadSlots: RawNewUploadSlot[];
    }>;
  }>;
};

export interface INewSubmissionService {
  initializeNextUnit: (studentId: number, courseId: number) => Observable<NewSubmission>;
  getUnit: (studentId: number, courseId: number, submissionId: string) => Observable<NewSubmissionWithCourseAndChildren>;
  submitUnit: (studentId: number, courseId: number, submissionId: string) => Observable<NewSubmission>;
  skipUnit: (studentId: number, courseId: number, submissionId: string) => Observable<NewSubmission>;
}

export class NewSubmissionService implements INewSubmissionService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public initializeNextUnit(studentId: number, courseId: number): Observable<NewSubmission> {
    const url = `${this.getBaseUrl(studentId, courseId)}/initializeNext`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public getUnit(studentId: number, courseId: number, submissionId: string): Observable<NewSubmissionWithCourseAndChildren> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionWithCourseAndChildren>(url).pipe(
      map(this.mapNewUnitWithCourseAndChildren),
    );
  }

  public submitUnit(studentId: number, courseId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${submissionId}/submissions`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public skipUnit(studentId: number, courseId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${submissionId}/skips`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  private getBaseUrl(studentId: number, courseId: number): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions`;
  }

  private readonly mapNewUnit = (newUnit: RawNewSubmission): NewSubmission => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
    };
  };

  private readonly mapNewUnitWithCourseAndChildren = (newUnit: RawNewSubmissionWithCourseAndChildren): NewSubmissionWithCourseAndChildren => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
      enrollment: {
        ...newUnit.enrollment,
        enrollmentDate: newUnit.enrollment.enrollmentDate === null ? null : new Date(newUnit.enrollment.enrollmentDate),
      },
      newAssignments: newUnit.newAssignments.map(a => ({
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
    };
  };
}
