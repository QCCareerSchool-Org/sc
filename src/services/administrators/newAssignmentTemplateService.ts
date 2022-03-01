import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentTemplate, NewPartTemplate, NewUnitTemplate, RawNewAssignmentTemplate, RawNewPartTemplate, RawNewUnitTemplate } from '@/domain/index';

type RawNewAssignmentTemplateWithParts = RawNewAssignmentTemplate & {
  unit: RawNewUnitTemplate;
  parts: RawNewPartTemplate[];
};

export type NewAssignmentTemplateWithParts = NewAssignmentTemplate & {
  unit: NewUnitTemplate;
  parts: NewPartTemplate[];
};

export interface INewAssignmentTemplateService {
  getAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentTemplateWithParts>;
}

export class NewAssignmentTemplateService implements INewAssignmentTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): Observable<NewAssignmentTemplateWithParts> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId);
    return this.httpService.get<RawNewAssignmentTemplateWithParts>(url).pipe(
      map(this.mapNewUnitTemplate),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}`;
  }

  private mapNewUnitTemplate(assignment: RawNewAssignmentTemplateWithParts): NewAssignmentTemplateWithParts {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
      unit: {
        ...assignment.unit,
        created: new Date(assignment.unit.created),
        modified: assignment.unit.modified === null ? null : new Date(assignment.unit.modified),
      },
      parts: assignment.parts.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
      })),
    };
  }
}
