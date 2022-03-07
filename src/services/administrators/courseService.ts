import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Course } from '@/domain/course';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';
import type { School } from '@/domain/school';

type RawCourseWithSchoolAndUnits = Course & {
  school: School;
  newUnitTemplates: RawNewUnitTemplate[];
};

export type CourseWithSchoolAndUnits = Course & {
  school: School;
  newUnitTemplates: NewUnitTemplate[];
};

export interface ICourseService {
  getCourse: (administratorId: number, schoolId: number, courseId: number) => Observable<CourseWithSchoolAndUnits>;
}

export class CourseService implements ICourseService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCourse(administratorId: number, schoolId: number, courseId: number): Observable<CourseWithSchoolAndUnits> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId);
    return this.httpService.get<RawCourseWithSchoolAndUnits>(url).pipe(
      map(this.mapCourseWithSchoolAndUnits),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}`;
  }

  private mapCourseWithSchoolAndUnits(course: RawCourseWithSchoolAndUnits): CourseWithSchoolAndUnits {
    return {
      ...course,
      newUnitTemplates: course.newUnitTemplates.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  }
}
