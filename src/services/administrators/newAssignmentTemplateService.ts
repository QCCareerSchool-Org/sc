import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';

export type NewAssignmentTemplatePayload = {
  title: string | null;
  description: string | null;
  assignmentNumber: number;
  optional: boolean;
};

type RawNewAssignmentTemplateWithUnitAndParts = RawNewAssignmentTemplate & {
  newUnitTemplate: RawNewUnitTemplate;
  newPartTemplates: RawNewPartTemplate[];
  newAssignmentMedia: RawNewAssignmentMedium[];
};

export type NewAssignmentTemplateWithUnitAndParts = NewAssignmentTemplate & {
  newUnitTemplate: NewUnitTemplate;
  newPartTemplates: NewPartTemplate[];
  newAssignmentMedia: NewAssignmentMedium[];
};

export interface INewAssignmentTemplateService {
  addAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewAssignmentTemplatePayload) => Observable<NewAssignmentTemplate>;
  getAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentTemplateWithUnitAndParts>;
  saveAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, payload: NewAssignmentTemplatePayload) => Observable<NewAssignmentTemplate>;
  deleteAssignment: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string) => Observable<void>;
}

export class NewAssignmentTemplateService implements INewAssignmentTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, payload: NewAssignmentTemplatePayload): Observable<NewAssignmentTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId);
    return this.httpService.post<RawNewAssignmentTemplate>(url, payload).pipe(
      map(this.mapNewAssignmentTemplate),
    );
  }

  public getAssignment(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): Observable<NewAssignmentTemplateWithUnitAndParts> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithUnitAndParts>(url).pipe(
      map(this.mapNewAssignmentTemplateWithUnitAndParts),
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

  private mapNewAssignmentTemplateWithUnitAndParts(assignment: RawNewAssignmentTemplateWithUnitAndParts): NewAssignmentTemplateWithUnitAndParts {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
      newUnitTemplate: {
        ...assignment.newUnitTemplate,
        created: new Date(assignment.newUnitTemplate.created),
        modified: assignment.newUnitTemplate.modified === null ? null : new Date(assignment.newUnitTemplate.modified),
      },
      newPartTemplates: assignment.newPartTemplates.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
      })),
      newAssignmentMedia: assignment.newAssignmentMedia.map(m => ({
        ...m,
        created: new Date(m.created),
        modified: m.modified === null ? null : new Date(m.modified),
      })),
    };
  }
}
