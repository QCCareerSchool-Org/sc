import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { RawTutorStudent, TutorStudent } from '@/domain/tutor/student';
import type { IHttpService, ProgressResponse } from '@/services/httpService';

export type NewUnitWithEnrollmentAndAssignments = NewUnit & {
  enrollment: Enrollment & {
    course: Course;
    student: TutorStudent;
  };
  newAssignments: NewAssignment[];
};

type RawNewUnitWithEnrollmentAndAssignments = RawNewUnit & {
  enrollment: RawEnrollment & {
    course: Course;
    student: RawTutorStudent;
  };
  newAssignments: RawNewAssignment[];
};

export interface INewUnitService {
  getUnit: (tutorId: number, studentId: number, unitId: string) => Observable<NewUnitWithEnrollmentAndAssignments>;
  uploadFeedback: (tutorId: number, studentId: number, unitId: string, file: File) => Observable<ProgressResponse<NewUnit>>;
  deleteFeedback: (tutorId: number, studentId: number, unitId: string) => Observable<NewUnit>;
  closeUnit: (tutorId: number, studentId: number, unitId: string) => Observable<NewUnit>;
  returnUnit: (tutorId: number, studentId: number, unitId: string, comment: string) => Observable<NewUnit>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(tutorId: number, studentId: number, unitId: string): Observable<NewUnitWithEnrollmentAndAssignments> {
    const url = `${this.getUrl(tutorId, studentId)}/${unitId}`;
    return this.httpService.get<RawNewUnitWithEnrollmentAndAssignments>(url).pipe(
      map(this.mapNewUnitWithStudentAndAssignments),
    );
  }

  public uploadFeedback(tutorId: number, studentId: number, unitId: string, file: File): Observable<ProgressResponse<NewUnit>> {
    const url = `${this.getUrl(tutorId, studentId)}/${unitId}/response`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    return this.httpService.putFile<RawNewUnit>(url, formData, { headers }).pipe(
      map(progressResponse => {
        if (progressResponse.type === 'progress') {
          return progressResponse;
        }
        return { type: 'data', value: this.mapNewUnit(progressResponse.value) };
      }),
    );
  }

  public deleteFeedback(tutorId: number, studentId: number, unitId: string): Observable<NewUnit> {
    const url = `${this.getUrl(tutorId, studentId)}/${unitId}/response`;
    return this.httpService.delete<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public closeUnit(tutorId: number, studentId: number, unitId: string): Observable<NewUnit> {
    const url = `${this.getUrl(tutorId, studentId)}/${unitId}/closes`;
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public returnUnit(tutorId: number, studentId: number, unitId: string, comment: string): Observable<NewUnit> {
    const url = `${this.getUrl(tutorId, studentId)}/${unitId}/returns`;
    return this.httpService.post<RawNewUnit>(url, { comment }).pipe(
      map(this.mapNewUnit),
    );
  }

  private getUrl(tutorId: number, studentId: number): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}/newUnits`;
  }

  private readonly mapNewUnit = (newUnit: RawNewUnit): NewUnit => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
    };
  };

  private readonly mapNewUnitWithStudentAndAssignments = (newUnit: RawNewUnitWithEnrollmentAndAssignments): NewUnitWithEnrollmentAndAssignments => {
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
