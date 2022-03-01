import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Course, NewAssignmentTemplate, NewUnitTemplate, RawNewAssignmentTemplate, RawNewUnitTemplate } from '@/domain/index';

type RawNewUnitTemplateWithAssignments = RawNewUnitTemplate & {
  course: Course;
  assignments: RawNewAssignmentTemplate[];
};

export type NewUnitTemplateWithAssignments = NewUnitTemplate & {
  course: Course;
  assignments: NewAssignmentTemplate[];
};

export interface INewUnitTemplateService {
  getUnit: (administratorId: number, schoolId: number, courseId: number, unitId: string) => Observable<NewUnitTemplateWithAssignments>;
}

export class NewUnitTemplateService implements INewUnitTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(administratorId: number, schoolId: number, courseId: number, unitId: string): Observable<NewUnitTemplateWithAssignments> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId);
    return this.httpService.get<RawNewUnitTemplateWithAssignments>(url).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}`;
  }

  private mapNewUnitTemplate(unit: RawNewUnitTemplateWithAssignments): NewUnitTemplateWithAssignments {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
      assignments: unit.assignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  }
}
