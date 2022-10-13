import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { Material, RawMaterial } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmission, RawNewSubmission } from '@/domain/newSubmission';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { RawStudentStudent, StudentStudent } from '@/domain/student/student';
import type { StudentTutor } from '@/domain/student/tutor';
import type { RawUnit, Unit } from '@/domain/unit';
import type { Video } from '@/domain/video';
import type { IHttpService } from '@/services/httpService';

export type EnrollmentWithStudentCourseAndUnits = Enrollment & {
  student: StudentStudent;
  course: Course & {
    newSubmissionTemplates: NewSubmissionTemplate[];
    units: Array<Unit & {
      materials: Material[];
      videos: Video[];
    }>;
  };
  tutor: StudentTutor | null;
  newSubmissions: NewSubmission[];
  materialCompletions: MaterialCompletion[];
};

type RawEnrollmentWithStudentCourseAndUnits = RawEnrollment & {
  student: RawStudentStudent;
  course: Course & {
    newSubmissionTemplates: RawNewSubmissionTemplate[];
    units: Array<RawUnit & {
      materials: RawMaterial[];
      videos: Video[];
    }>;
  };
  tutor: StudentTutor;
  newSubmissions: RawNewSubmission[];
  materialCompletions: MaterialCompletion[];
};

export interface IEnrollmentService {
  getEnrollment: (studentId: number, courseId: number) => Observable<EnrollmentWithStudentCourseAndUnits>;
}

export class EnrollmentService implements IEnrollmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getEnrollment(studentId: number, courseId: number): Observable<EnrollmentWithStudentCourseAndUnits> {
    const url = `${this.getUrl(studentId)}/${courseId}`;
    return this.httpService.get<RawEnrollmentWithStudentCourseAndUnits>(url).pipe(
      map(this.mapEnrollmentWithStudentCourseAndUnits),
    );
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}/courses`;
  }

  private readonly mapEnrollmentWithStudentCourseAndUnits = (enrollment: RawEnrollmentWithStudentCourseAndUnits): EnrollmentWithStudentCourseAndUnits => {
    return {
      ...enrollment,
      enrollmentDate: enrollment.enrollmentDate === null ? null : new Date(enrollment.enrollmentDate),
      student: {
        ...enrollment.student,
        lastLogin: enrollment.student.lastLogin === null ? null : new Date(enrollment.student.lastLogin),
        expiry: enrollment.student.expiry === null ? null : new Date(enrollment.student.expiry),
        creationDate: new Date(enrollment.student.creationDate),
        timestamp: new Date(enrollment.student.timestamp),
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
