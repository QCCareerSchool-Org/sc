import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Country } from '@/domain/country';
import type { Course } from '@/domain/course';
import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { Province } from '@/domain/province';
import type { RawStudentStudent, StudentStudent } from '@/domain/student/student';
import type { IHttpService } from '@/services/httpService';

export type StudentWithCountryProvinceAndEnrollments = StudentStudent & {
  country: Country;
  province: Province | null;
  enrollments: Array<Enrollment & { course: Course }>;
};

export type RawStudentWithCountryProvinceAndEnrollments = RawStudentStudent & {
  country: Country;
  province: Province | null;
  enrollments: Array<RawEnrollment & { course: Course }>;
};

export interface IStudentService {
  getStudent: (studentId: number) => Observable<StudentWithCountryProvinceAndEnrollments>;
}

export class StudentService implements IStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getStudent(studentId: number): Observable<StudentWithCountryProvinceAndEnrollments> {
    const url = this.getUrl(studentId);
    return this.httpService.get<RawStudentWithCountryProvinceAndEnrollments>(url).pipe(
      map(this.mapStudent),
    );
  }

  private getUrl(studentId: number): string {
    return `${endpoint}/students/${studentId}`;
  }

  private readonly mapStudent = (student: RawStudentWithCountryProvinceAndEnrollments): StudentWithCountryProvinceAndEnrollments => {
    return {
      ...student,
      lastLogin: student.lastLogin === null ? null : new Date(student.lastLogin),
      expiry: student.expiry === null ? null : new Date(student.expiry),
      creationDate: new Date(student.creationDate),
      timestamp: new Date(student.timestamp),
      enrollments: student.enrollments.map(e => ({
        ...e,
        enrollmentDate: e.enrollmentDate === null ? null : new Date(e.enrollmentDate),
      })),
    };
  };
}
