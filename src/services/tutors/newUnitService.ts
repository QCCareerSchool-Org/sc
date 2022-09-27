import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewSubmission, RawNewSubmission } from '@/domain/newSubmission';
import type { RawTutorStudent, TutorStudent } from '@/domain/tutor/student';
import type { IHttpService, ProgressResponse } from '@/services/httpService';

export type NewSubmissionWithEnrollmentAndAssignments = NewSubmission & {
  enrollment: Enrollment & {
    course: Course;
    student: TutorStudent;
  };
  newAssignments: NewAssignment[];
};

type RawNewSubmissionWithEnrollmentAndAssignments = RawNewSubmission & {
  enrollment: RawEnrollment & {
    course: Course;
    student: RawTutorStudent;
  };
  newAssignments: RawNewAssignment[];
};

export interface INewUnitService {
  getUnit: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmissionWithEnrollmentAndAssignments>;
  uploadFeedback: (tutorId: number, studentId: number, submissionId: string, file: File) => Observable<ProgressResponse<NewSubmission>>;
  deleteFeedback: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmission>;
  closeUnit: (tutorId: number, studentId: number, submissionId: string) => Observable<NewSubmission>;
  returnUnit: (tutorId: number, studentId: number, submissionId: string, comment: string) => Observable<NewSubmission>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmissionWithEnrollmentAndAssignments> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionWithEnrollmentAndAssignments>(url).pipe(
      map(this.mapNewUnitWithStudentAndAssignments),
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
        return { type: 'data', value: this.mapNewUnit(progressResponse.value) };
      }),
    );
  }

  public deleteFeedback(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/response`;
    return this.httpService.delete<RawNewSubmission>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public closeUnit(tutorId: number, studentId: number, submissionId: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/closes`;
    return this.httpService.post<RawNewSubmission>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public returnUnit(tutorId: number, studentId: number, submissionId: string, comment: string): Observable<NewSubmission> {
    const url = `${this.getUrl(tutorId, studentId)}/${submissionId}/returns`;
    return this.httpService.post<RawNewSubmission>(url, { comment }).pipe(
      map(this.mapNewUnit),
    );
  }

  private getUrl(tutorId: number, studentId: number): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}/newSubmissions`;
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

  private readonly mapNewUnitWithStudentAndAssignments = (newUnit: RawNewSubmissionWithEnrollmentAndAssignments): NewSubmissionWithEnrollmentAndAssignments => {
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
        student: {
          ...newUnit.enrollment.student,
          timestamp: new Date(newUnit.enrollment.student.timestamp),
        },
      },
      newAssignments: newUnit.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  };
}
