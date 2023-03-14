import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Country } from '@/domain/country';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { Province } from '@/domain/province';
import type { School } from '@/domain/school';
import type { RawStudent, Student } from '@/domain/student/student';
import type { IHttpService } from '@/services/httpService';

export type StudentWithCountryProvinceAndEnrollments = Student & {
  country: Country;
  province: Province | null;
  enrollments: Array<Enrollment & { course: Course & { school: School } }>;
};

export type RawStudentWithCountryProvinceAndEnrollments = RawStudent & {
  country: Country;
  province: Province | null;
  enrollments: Array<RawEnrollment & { course: Course & { school: School } }>;
};

export interface IStudentService {
  getStudent: (studentId: number) => Observable<StudentWithCountryProvinceAndEnrollments>;
  updateEmailAddress: (studentId: number, emailAddress: string) => Observable<Student>;
}

export class StudentService implements IStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getStudent(studentId: number): Observable<StudentWithCountryProvinceAndEnrollments> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawStudentWithCountryProvinceAndEnrollments>(url).pipe(
      map(this.mapStudentWithChildren),
    );
  }

  public updateEmailAddress(studentId: number, emailAddress: string): Observable<Student> {
    const url = `${this.getUrl(studentId)}/emailAddress`;
    const body = { emailAddress };
    return this.httpService.put<RawStudent>(url, body).pipe(
      map(this.mapStudent),
    );
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}`;
  }

  private readonly mapStudent = (student: RawStudent): Student => {
    return {
      ...student,
      lastLogin: student.lastLogin === null ? null : new Date(student.lastLogin),
      expiry: student.expiry === null ? null : new Date(student.expiry),
      created: new Date(student.created),
      modified: new Date(student.modified),
    };
  };

  private readonly mapStudentWithChildren = (student: RawStudentWithCountryProvinceAndEnrollments): StudentWithCountryProvinceAndEnrollments => {
    return {
      ...student,
      lastLogin: student.lastLogin === null ? null : new Date(student.lastLogin),
      expiry: student.expiry === null ? null : new Date(student.expiry),
      created: new Date(student.created),
      modified: new Date(student.modified),
      enrollments: student.enrollments.map(e => ({
        ...e,
        enrollmentDate: e.enrollmentDate === null ? null : new Date(e.enrollmentDate),
      })),
    };
  };
}
