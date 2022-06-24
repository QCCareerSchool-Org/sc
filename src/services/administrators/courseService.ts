import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { Currency } from '@/domain/currency';
import type { NewMaterialUnit, RawNewMaterialUnit } from '@/domain/newMaterialUnit';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';
import type { NewUnitTemplatePrice, RawNewUnitTemplatePrice } from '@/domain/newUnitTemplatePrice';
import type { School } from '@/domain/school';
import type { IHttpService } from '@/services/httpService';

type RawCourseWithSchoolAndUnitTemplatesAndPrices = Course & {
  school: School;
  newUnitTemplates: Array<RawNewUnitTemplate & {
    prices: Array<RawNewUnitTemplatePrice & {
      currency: Currency;
    }>;
  }>;
  newMaterialUnits: RawNewMaterialUnit[];
};

export type CourseWithSchoolAndUnitTemplatesAndPrices = Course & {
  school: School;
  newUnitTemplates: Array<NewUnitTemplate & {
    prices: Array<NewUnitTemplatePrice & {
      currency: Currency;
    }>;
  }>;
  newMaterialUnits: NewMaterialUnit[];
};

export type CourseWithSchool = Course & {
  school: School;
};

export interface ICourseService {
  getCourse: (administratorId: number, courseId: number) => Observable<CourseWithSchoolAndUnitTemplatesAndPrices>;
  enableCourse: (administratorId: number, courseId: number, enable: boolean) => Observable<Course>;
  getAllCourses: (administratorId: number) => Observable<CourseWithSchool[]>;
}

export class CourseService implements ICourseService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getCourse(administratorId: number, courseId: number): Observable<CourseWithSchoolAndUnitTemplatesAndPrices> {
    const url = `${this.getBaseUrl(administratorId)}/courses/${courseId}`;
    return this.httpService.get<RawCourseWithSchoolAndUnitTemplatesAndPrices>(url).pipe(
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

  private readonly mapCourseWithSchoolAndUnitTemplates = (course: RawCourseWithSchoolAndUnitTemplatesAndPrices): CourseWithSchoolAndUnitTemplatesAndPrices => {
    return {
      ...course,
      newUnitTemplates: course.newUnitTemplates.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
        prices: u.prices.map(p => ({
          ...p,
          created: new Date(p.created),
          modified: p.modified === null ? null : new Date(p.modified),
        })),
      })),
      newMaterialUnits: course.newMaterialUnits.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  };
}
