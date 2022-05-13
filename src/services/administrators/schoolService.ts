import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { School } from '@/domain/school';
import type { IHttpService } from '@/services/httpService';

export type SchoolWithCourses = School & {
  courses: Course[];
};

export interface ISchoolService {
  getSchools: (administratorId: number) => Observable<School[]>;
  getSchool: (administratorId: number, schoolId: number) => Observable<SchoolWithCourses>;
}

export class SchoolService implements ISchoolService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getSchools(administratorId: number): Observable<School[]> {
    const url = `${this.getBaseUrl(administratorId)}/schools`;
    return this.httpService.get<School[]>(url);
  }

  public getSchool(administratorId: number, schoolId: number): Observable<SchoolWithCourses> {
    const url = `${this.getBaseUrl(administratorId)}/schools/${schoolId}`;
    return this.httpService.get<SchoolWithCourses>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}`;
  }
}
