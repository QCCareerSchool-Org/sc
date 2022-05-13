import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';
import type { RawStudentStudent, StudentStudent } from '@/domain/student/student';
import type { StudentTutor } from '@/domain/student/tutor';
import type { IHttpService } from '@/services/httpService';

export type EnrollmentWithStudentCourseAndUnits = Enrollment & {
  student: StudentStudent;
  course: Course & {
    newUnitTemplates: NewUnitTemplate[];
  };
  tutor: StudentTutor;
  newUnits: NewUnit[];
};

type RawEnrollmentWithStudentCourseAndUnits = RawEnrollment & {
  student: RawStudentStudent;
  course: Course & {
    newUnitTemplates: RawNewUnitTemplate[];
  };
  tutor: StudentTutor;
  newUnits: RawNewUnit[];
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
        newUnitTemplates: enrollment.course.newUnitTemplates.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
        })),
      },
      newUnits: enrollment.newUnits.map(u => ({
        ...u,
        submitted: u.submitted === null ? null : new Date(u.submitted),
        transferred: u.transferred === null ? null : new Date(u.transferred),
        closed: u.closed === null ? null : new Date(u.closed),
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  };
}
