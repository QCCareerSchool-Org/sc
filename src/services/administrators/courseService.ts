import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Course, NewUnitTemplate, RawNewUnitTemplate, School } from '@/domain/index';

type RawCourseWithUnits = Course & {
  school: School;
  newUnitTemplates: RawNewUnitTemplate[];
};

export type CourseWithUnits = Course & {
  school: School;
  newUnitTemplates: NewUnitTemplate[];
};

export interface ICourseService {
  getCourse: (administratorId: number, schoolId: number, courseId: number) => Observable<CourseWithUnits>;
}

export class CourseService implements ICourseService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCourse(administratorId: number, schoolId: number, courseId: number): Observable<CourseWithUnits> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId);
    return this.httpService.get<RawCourseWithUnits>(url).pipe(
      map(this.mapCourse),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}`;
  }

  private mapCourse(course: RawCourseWithUnits): CourseWithUnits {
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
