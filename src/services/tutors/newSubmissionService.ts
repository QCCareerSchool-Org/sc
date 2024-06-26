import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/tutor/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/tutor/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/tutor/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/tutor/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/tutor/newUploadSlot';
import type { RawStudent, Student } from '@/domain/tutor/student';
import type { IHttpService, ProgressResponse } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewSubmissionWithEnrollmentAndAssignments = NewSubmission & {
  enrollment: Enrollment & {
    course: Course;
    student: Student;
  };
  newAssignments: Array<NewAssignment & {
    newParts: Array<NewPart & {
      newTextBoxes: NewTextBox[];
      newUploadSlots: NewUploadSlot[];
    }>;
  }>;
};

type RawNewSubmissionWithEnrollmentAndAssignments = RawNewSubmission & {
  enrollment: RawEnrollment & {
    course: Course;
    student: RawStudent;
  };
  newAssignments: Array<RawNewAssignment & {
    newParts: Array<RawNewPart & {
      newTextBoxes: RawNewTextBox[];
      newUploadSlots: RawNewUploadSlot[];
    }>;
  }>;
};

export interface INewSubmissionService {
  getSubmission: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmissionWithEnrollmentAndAssignments>;
  uploadFeedback: (tutorId: number, studentId: number, submissionId: string, file: File) => Observable<ProgressResponse<NewSubmission>>;
  deleteFeedback: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmission>;
  closeSubmission: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmission>;
  returnSubmission: (tutorId: number, studentId: number, submissionId: string, comment: string) => Observable<NewSubmission>;
}

export class NewSubmissionService implements INewSubmissionService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getSubmission(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmissionWithEnrollmentAndAssignments> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionWithEnrollmentAndAssignments>(url).pipe(
      map(this.mapNewSubmissionWithStudentAndAssignments),
    );
  }

  public uploadFeedback(tutorId: number, studentId: number, submissionId: string, file: File): Observable<ProgressResponse<NewSubmission>> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/response`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    return this.httpService.putFile<RawNewSubmission>(url, formData, { headers }).pipe(
      map(progressResponse => {
        if (progressResponse.type === 'progress') {
          return progressResponse;
        }
        return { type: 'data', value: this.mapNewSubmission(progressResponse.value) };
      }),
    );
  }

  public deleteFeedback(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/response`;
    return this.httpService.delete<RawNewSubmission>(url).pipe(
      map(this.mapNewSubmission),
    );
  }

  public closeSubmission(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/closes`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewSubmission),
    );
  }

  public returnSubmission(tutorId: number, studentId: number, submissionId: string, comment: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/returns`;
    return this.httpService.post<RawNewSubmission>(url, { comment }).pipe(
      map(this.mapNewSubmission),
    );
  }

  private getUrl(tutorId: number, studentId: number): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}/newSubmissions`;
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

  private readonly mapNewSubmissionWithStudentAndAssignments = (newSubmission: RawNewSubmissionWithEnrollmentAndAssignments): NewSubmissionWithEnrollmentAndAssignments => {
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
        dueDate: newSubmission.enrollment.dueDate === null ? null : new Date(newSubmission.enrollment.dueDate),
        student: {
          ...newSubmission.enrollment.student,
          modified: new Date(newSubmission.enrollment.student.modified),
        },
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
    };
  };
}
