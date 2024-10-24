import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { Material, RawMaterial } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { Metadata } from '@/domain/metadata';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { School } from '@/domain/school';
import type { NewSubmission, RawNewSubmission } from '@/domain/student/newSubmission';
import type { RawStudent, Student } from '@/domain/student/student';
import type { Tutor } from '@/domain/student/tutor';
import type { RawUnit, Unit } from '@/domain/unit';
import type { Variant } from '@/domain/variant';
import type { Video } from '@/domain/video';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type EnrollmentWithStudentCourseAndUnits = Enrollment & {
  student: Student;
  course: Course & {
    school: School;
    variant: Variant | null;
    newSubmissionTemplates: NewSubmissionTemplate[];
    units: Array<Unit & {
      materials: Array<Material & { complete: boolean; materialData: Record<string, string> }>;
      videos: Video[];
    }>;
  };
  tutor: Tutor | null;
  newSubmissions: NewSubmission[];
  materialCompletions: MaterialCompletion[];
  metadata: Metadata[];
};

type RawEnrollmentWithStudentCourseAndUnits = RawEnrollment & {
  student: RawStudent;
  course: Course & {
    school: School;
    variant: Variant | null;
    newSubmissionTemplates: RawNewSubmissionTemplate[];
    units: Array<RawUnit & {
      materials: Array<RawMaterial & { complete: boolean; materialData: Record<string, string> }>;
      videos: Video[];
    }>;
  };
  tutor: Tutor;
  newSubmissions: RawNewSubmission[];
  materialCompletions: MaterialCompletion[];
  metadata: Metadata[];
};

export interface IEnrollmentService {
  getEnrollment: (studentId: number, courseId: number) => Observable<EnrollmentWithStudentCourseAndUnits>;
  insertOrUpdateMetadata: (studentId: number, courseId: number, name: string, value: string | null) => Observable<void>;
}

export class EnrollmentService implements IEnrollmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getEnrollment(studentId: number, courseId: number): Observable<EnrollmentWithStudentCourseAndUnits> {
    const url = `${this.getUrl(studentId)}/${courseId}`;
    return this.httpService.get<RawEnrollmentWithStudentCourseAndUnits>(url).pipe(
      map(this.mapEnrollmentWithStudentCourseAndUnits),
    );
  }

  public insertOrUpdateMetadata(studentId: number, courseId: number, name: string, value: string | null): Observable<void> {
    const url = `${this.getUrl(studentId)}/${courseId}/metadata`;
    const body = { name, value };
    return this.httpService.post<void>(url, body);
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}/courses`;
  }

  private readonly mapEnrollmentWithStudentCourseAndUnits = (enrollment: RawEnrollmentWithStudentCourseAndUnits): EnrollmentWithStudentCourseAndUnits => {
    return {
      ...enrollment,
      enrollmentDate: enrollment.enrollmentDate === null ? null : new Date(enrollment.enrollmentDate),
      dueDate: enrollment.dueDate === null ? null : new Date(enrollment.dueDate),
      student: {
        ...enrollment.student,
        lastLogin: enrollment.student.lastLogin === null ? null : new Date(enrollment.student.lastLogin),
        expiry: enrollment.student.expiry === null ? null : new Date(enrollment.student.expiry),
        created: new Date(enrollment.student.created),
        modified: new Date(enrollment.student.modified),
      },
      course: {
        ...enrollment.course,
        newSubmissionTemplates: enrollment.course.newSubmissionTemplates.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
        })),
        units: enrollment.course.units.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
          materials: u.materials.map(m => ({
            ...m,
            created: new Date(m.created),
            modified: m.modified === null ? null : new Date(m.modified),
          })),
        })),
      },
      newSubmissions: enrollment.newSubmissions.map(s => ({
        ...s,
        submitted: s.submitted === null ? null : new Date(s.submitted),
        transferred: s.transferred === null ? null : new Date(s.transferred),
        closed: s.closed === null ? null : new Date(s.closed),
        created: new Date(s.created),
        modified: s.modified === null ? null : new Date(s.modified),
      })),
    };
  };
}
