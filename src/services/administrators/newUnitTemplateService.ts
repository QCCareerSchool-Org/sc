import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';
import type { IHttpService } from '@/services/httpService';

export type NewUnitTemplateAddPayload = {
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  order: number;
  optional: boolean;
};

export type NewUnitTemplateSavePayload = {
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  order: number;
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
  addUnit: (administratorId: number, payload: NewUnitTemplateAddPayload) => Observable<NewUnitTemplate>;
  getUnit: (administratorId: number, unitId: string) => Observable<NewUnitTemplateWithCourseAndAssignments>;
  saveUnit: (administratorId: number, unitId: string, payload: NewUnitTemplateSavePayload) => Observable<NewUnitTemplate>;
  deleteUnit: (administratorId: number, unitId: string) => Observable<void>;
}

export class NewUnitTemplateService implements INewUnitTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addUnit(administratorId: number, payload: NewUnitTemplateAddPayload): Observable<NewUnitTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewUnitTemplate>(url, payload).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  public getUnit(administratorId: number, unitId: string): Observable<NewUnitTemplateWithCourseAndAssignments> {
    const url = `${this.getBaseUrl(administratorId)}/${unitId}`;
    return this.httpService.get<RawNewUnitTemplateWithCourseAndAssignments>(url).pipe(
      map(this.mapNewUnitTemplateWithCourseAndAssignments),
    );
  }

  public saveUnit(administratorId: number, unitId: string, payload: NewUnitTemplateSavePayload): Observable<NewUnitTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${unitId}`;
    return this.httpService.put<RawNewUnitTemplate>(url, payload).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  public deleteUnit(administratorId: number, unitId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${unitId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newUnitTemplates`;
  }

  private readonly mapNewUnitTemplate = (unit: RawNewUnitTemplate): NewUnitTemplate => {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
    };
  };

  private readonly mapNewUnitTemplateWithCourseAndAssignments = (unit: RawNewUnitTemplateWithCourseAndAssignments): NewUnitTemplateWithCourseAndAssignments => {
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
  };
}
