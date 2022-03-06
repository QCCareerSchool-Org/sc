import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentTemplate, NewPartTemplate, NewUnitTemplate, RawNewAssignmentTemplate, RawNewPartTemplate, RawNewUnitTemplate } from '@/domain/index';

export type NewAssignmentTemplatePayload = {
  title: string | null;
  description: string | null;
  assignmentNumber: number;
  optional: boolean;
};

type RawNewAssignmentTemplateWithParts = RawNewAssignmentTemplate & {
  unit: RawNewUnitTemplate;
  parts: RawNewPartTemplate[];
};

export type NewAssignmentTemplateWithParts = NewAssignmentTemplate & {
  unit: NewUnitTemplate;
  parts: NewPartTemplate[];
};

export interface INewAssignmentTemplateService {
  insertAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewAssignmentTemplatePayload) => Observable<NewAssignmentTemplate>;
  getAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentTemplateWithParts>;
  saveAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, payload: NewAssignmentTemplatePayload) => Observable<NewAssignmentTemplate>;
  deleteAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string) => Observable<void>;
}

export class NewAssignmentTemplateService implements INewAssignmentTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public insertAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewAssignmentTemplatePayload): Observable<NewAssignmentTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId);
    return this.httpService.post<RawNewAssignmentTemplate>(url, payload).pipe(
      map(this.mapNewAssignmentTemplate),
    );
  }

  public getAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): Observable<NewAssignmentTemplateWithParts> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithParts>(url).pipe(
      map(this.mapNewAssignmentTemplateWithParts),
    );
  }

  public saveAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, payload: NewAssignmentTemplatePayload): Observable<NewAssignmentTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId)}/${assignmentId}`;
    return this.httpService.put<RawNewAssignmentTemplate>(url, payload).pipe(
      map(this.mapNewAssignmentTemplate),
    );
  }

  public deleteAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId)}/${assignmentId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments`;
  }

  private mapNewAssignmentTemplate(assignment: RawNewAssignmentTemplate): NewAssignmentTemplate {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
    };
  }

  private mapNewAssignmentTemplateWithParts(assignment: RawNewAssignmentTemplateWithParts): NewAssignmentTemplateWithParts {
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
