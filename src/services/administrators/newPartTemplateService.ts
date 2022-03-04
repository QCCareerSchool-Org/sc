import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentTemplate, NewPartTemplate, NewTextBoxTemplate, NewUploadSlotTemplate, RawNewAssignmentTemplate, RawNewPartTemplate, RawNewTextBoxTemplate, RawNewUploadSlotTemplate } from '@/domain/index';

export type NewPartTemplatePayload = {
  title: string | null;
  description: string | null;
  partNumber: number;
  optional: boolean;
};

type RawNewPartTemplateWithInputs = RawNewPartTemplate & {
  assignment: RawNewAssignmentTemplate;
  textBoxes: RawNewTextBoxTemplate[];
  uploadSlots: RawNewUploadSlotTemplate[];
};

export type NewPartTemplateWithInputs = NewPartTemplate & {
  assignment: NewAssignmentTemplate;
  textBoxes: NewTextBoxTemplate[];
  uploadSlots: NewUploadSlotTemplate[];
};

export interface INewPartTemplateService {
  addPart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, data: NewPartTemplatePayload) => Observable<NewPartTemplate>;
  getPart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string) => Observable<NewPartTemplateWithInputs>;
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

  public getPart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): Observable<NewPartTemplateWithInputs> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId)}/${partId}`;
    return this.httpService.get<RawNewPartTemplateWithInputs>(url).pipe(
      map(this.mapNewParTemplateWithInputs),
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

  private mapNewParTemplateWithInputs(part: RawNewPartTemplateWithInputs): NewPartTemplateWithInputs {
    return {
      ...part,
      created: new Date(part.created),
      modified: part.modified === null ? null : new Date(part.modified),
      assignment: {
        ...part.assignment,
        created: new Date(part.assignment.created),
        modified: part.assignment.modified === null ? null : new Date(part.assignment.modified),
      },
      textBoxes: part.textBoxes.map(t => ({
        ...t,
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
      uploadSlots: part.uploadSlots.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  }
}
