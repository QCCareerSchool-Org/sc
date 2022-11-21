import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Currency } from '@/domain/currency';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { NewSubmissionTemplatePrice, RawNewSubmissionTemplatePrice } from '@/domain/newSubmissionTemplatePrice';
import type { School } from '@/domain/school';
import type { RawUnit, Unit } from '@/domain/unit';
import type { IHttpService } from '@/services/httpService';

type RawCourseWithSchoolAndSubmissionTemplatesAndPrices = Course & {
  school: School;
  newSubmissionTemplates: Array<RawNewSubmissionTemplate & {
    prices: Array<RawNewSubmissionTemplatePrice & {
      currency: Currency;
    }>;
  }>;
  units: RawUnit[];
};

export type CourseWithSchoolAndSubmissionTemplatesAndPrices = Course & {
  school: School;
  newSubmissionTemplates: Array<NewSubmissionTemplate & {
    prices: Array<NewSubmissionTemplatePrice & {
      currency: Currency;
    }>;
  }>;
  units: Unit[];
};

export type CourseWithSchool = Course & {
  school: School;
};

export interface ICourseService {
  getCourse: (administratorId: number, courseId: number) => Observable<CourseWithSchoolAndSubmissionTemplatesAndPrices>;
  enableCourse: (administratorId: number, courseId: number, enable: boolean) => Observable<Course>;
  getAllCourses: (administratorId: number) => Observable<CourseWithSchool[]>;
}

export class CourseService implements ICourseService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCourse(administratorId: number, courseId: number): Observable<CourseWithSchoolAndSubmissionTemplatesAndPrices> {
    const url = `${this.getBaseUrl(administratorId)}/courses/${courseId}`;
    return this.httpService.get<RawCourseWithSchoolAndSubmissionTemplatesAndPrices>(url).pipe(
      map(this.mapCourseWithSchoolAndUnitTemplates),
    );
  }

  public enableCourse(administratorId: number, courseId: number, enable: boolean): Observable<Course> {
    const url = `${this.getBaseUrl(administratorId)}/courses/${courseId}/enable`;
    return this.httpService.post<Course>(url, { enable });
  }

  public getAllCourses(administratorId: number): Observable<CourseWithSchool[]> {
    const url = `${this.getBaseUrl(administratorId)}/courses`;
    return this.httpService.get<CourseWithSchool[]>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}`;
  }

  private readonly mapCourseWithSchoolAndUnitTemplates = (course: RawCourseWithSchoolAndSubmissionTemplatesAndPrices): CourseWithSchoolAndSubmissionTemplatesAndPrices => {
    return {
      ...course,
      newSubmissionTemplates: course.newSubmissionTemplates.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
        prices: u.prices.map(p => ({
          ...p,
          created: new Date(p.created),
          modified: p.modified === null ? null : new Date(p.modified),
        })),
      })),
      units: course.units.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  };
}
