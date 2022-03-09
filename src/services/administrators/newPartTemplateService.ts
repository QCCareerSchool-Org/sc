import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate, RawNewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate, RawNewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';

export type NewPartTemplatePayload = {
  title: string;
  description: string | null;
  partNumber: number;
  optional: boolean;
};

type RawNewPartTemplateWithAssignmentAndInputs = RawNewPartTemplate & {
  newAssignmentTemplate: RawNewAssignmentTemplate;
  newTextBoxTemplates: RawNewTextBoxTemplate[];
  newUploadSlotTemplates: RawNewUploadSlotTemplate[];
};

export type NewPartTemplateWithAssignmentAndInputs = NewPartTemplate & {
  newAssignmentTemplate: NewAssignmentTemplate;
  newTextBoxTemplates: NewTextBoxTemplate[];
  newUploadSlotTemplates: NewUploadSlotTemplate[];
};

export interface INewPartTemplateService {
  addPart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, data: NewPartTemplatePayload) => Observable<NewPartTemplate>;
  getPart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string) => Observable<NewPartTemplateWithAssignmentAndInputs>;
  savePart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, data: NewPartTemplatePayload) => Observable<NewPartTemplate>;
  deletePart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string) => Observable<void>;
}

export class NewPartTemplateService implements INewPartTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addPart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, data: NewPartTemplatePayload): Observable<NewPartTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId);
    return this.httpService.post<RawNewPartTemplate>(url, data).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public getPart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): Observable<NewPartTemplateWithAssignmentAndInputs> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId)}/${partId}`;
    return this.httpService.get<RawNewPartTemplateWithAssignmentAndInputs>(url).pipe(
      map(this.mapNewParTemplateWithAssignmentAndInputs),
    );
  }

  public savePart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, data: NewPartTemplatePayload): Observable<NewPartTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId)}/${partId}`;
    return this.httpService.put<RawNewPartTemplate>(url, data).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public deletePart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId)}/${partId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts`;
  }

  private mapNewParTemplate(part: RawNewPartTemplate): NewPartTemplate {
    return {
      ...part,
      created: new Date(part.created),
      modified: part.modified === null ? null : new Date(part.modified),
    };
  }

  private mapNewParTemplateWithAssignmentAndInputs(part: RawNewPartTemplateWithAssignmentAndInputs): NewPartTemplateWithAssignmentAndInputs {
    return {
      ...part,
      created: new Date(part.created),
      modified: part.modified === null ? null : new Date(part.modified),
      newAssignmentTemplate: {
        ...part.newAssignmentTemplate,
        created: new Date(part.newAssignmentTemplate.created),
        modified: part.newAssignmentTemplate.modified === null ? null : new Date(part.newAssignmentTemplate.modified),
      },
      newTextBoxTemplates: part.newTextBoxTemplates.map(t => ({
        ...t,
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
      newUploadSlotTemplates: part.newUploadSlotTemplates.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  }
}
