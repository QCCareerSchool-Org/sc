import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Course, NewAssignmentTemplate, NewUnitTemplate, RawNewAssignmentTemplate, RawNewUnitTemplate } from '@/domain/index';

export type NewUnitTemplatePayload = {
  title: string | null;
  description: string | null;
  unitLetter: string;
  optional: boolean;
};

type RawNewUnitTemplateWithCourseAndAssignments = RawNewUnitTemplate & {
  course: Course;
  newAssignmentTemplates: RawNewAssignmentTemplate[];
};

export type NewUnitTemplateWithCourseAndAssignments = NewUnitTemplate & {
  course: Course;
  newAssignmentTemplates: NewAssignmentTemplate[];
};

export interface INewUnitTemplateService {
  addUnit: (administratorId: number, schoolId: number, courseId: number, payload: NewUnitTemplatePayload) => Observable<NewUnitTemplate>;
  getUnit: (administratorId: number, schoolId: number, courseId: number, unitId: string) => Observable<NewUnitTemplateWithCourseAndAssignments>;
  saveUnit: (administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewUnitTemplatePayload) => Observable<NewUnitTemplate>;
  deleteUnit: (administratorId: number, schoolId: number, courseId: number, unitId: string) => Observable<void>;
}

export class NewUnitTemplateService implements INewUnitTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addUnit(administratorId: number, schoolId: number, courseId: number, payload: NewUnitTemplatePayload): Observable<NewUnitTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId);
    return this.httpService.post<RawNewUnitTemplate>(url, payload).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  public getUnit(administratorId: number, schoolId: number, courseId: number, unitId: string): Observable<NewUnitTemplateWithCourseAndAssignments> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId)}/${unitId}`;
    return this.httpService.get<RawNewUnitTemplateWithCourseAndAssignments>(url).pipe(
      map(this.mapNewUnitTemplateWithCourseAndAssignments),
    );
  }

  public saveUnit(administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewUnitTemplatePayload): Observable<NewUnitTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId)}/${unitId}`;
    return this.httpService.put<RawNewUnitTemplate>(url, payload).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  public deleteUnit(administratorId: number, schoolId: number, courseId: number, unitId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId)}/${unitId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates`;
  }

  private mapNewUnitTemplate(unit: RawNewUnitTemplate): NewUnitTemplate {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
    };
  }

  private mapNewUnitTemplateWithCourseAndAssignments(unit: RawNewUnitTemplateWithCourseAndAssignments): NewUnitTemplateWithCourseAndAssignments {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
      newAssignmentTemplates: unit.newAssignmentTemplates.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  }
}
