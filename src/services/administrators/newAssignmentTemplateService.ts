import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate, RawNewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUnitTemplate, RawNewUnitTemplate } from '@/domain/newUnitTemplate';
import type { NewUploadSlotTemplate, RawNewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { IHttpService } from '@/services/httpService';

export type NewAssignmentTemplateAddPayload = {
  unitId: string;
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: string;
  markingCriteria: string | null;
  optional: boolean;
};

export type NewAssignmentTemplateSavePayload = {
  assignmentNumber: number;
  title: string | null;
  description: string | null;
  descriptionType: string;
  markingCriteria: string | null;
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

type RawNewAssignmentTemplateWithUnitAndPartsAndInputs = RawNewAssignmentTemplate & {
  newUnitTemplate: RawNewUnitTemplate;
  newPartTemplates: Array<RawNewPartTemplate & {
    newTextBoxTemplates: RawNewTextBoxTemplate[];
    newUploadSlotTemplates: RawNewUploadSlotTemplate[];
    newPartMedia: RawNewPartMedium[];
  }>;
  newAssignmentMedia: RawNewAssignmentMedium[];
};

export type NewAssignmentTemplateWithUnitAndPartsAndInputs = NewAssignmentTemplate & {
  newUnitTemplate: NewUnitTemplate;
  newPartTemplates: Array<NewPartTemplate & {
    newTextBoxTemplates: NewTextBoxTemplate[];
    newUploadSlotTemplates: NewUploadSlotTemplate[];
    newPartMedia: NewPartMedium[];
  }>;
  newAssignmentMedia: NewAssignmentMedium[];
};

export interface INewAssignmentTemplateService {
  addAssignment: (administratorId: number, payload: NewAssignmentTemplateAddPayload) => Observable<NewAssignmentTemplate>;
  getAssignment: (administratorId: number, assignmentId: string) => Observable<NewAssignmentTemplateWithUnitAndParts>;
  getAssignmentWithInputs: (administratorId: number, assignmentId: string) => Observable<NewAssignmentTemplateWithUnitAndPartsAndInputs>;
  saveAssignment: (administratorId: number, assignmentId: string, payload: NewAssignmentTemplateSavePayload) => Observable<NewAssignmentTemplate>;
  deleteAssignment: (administratorId: number, assignmentId: string) => Observable<void>;
}

export class NewAssignmentTemplateService implements INewAssignmentTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addAssignment(administratorId: number, payload: NewAssignmentTemplateAddPayload): Observable<NewAssignmentTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewAssignmentTemplate>(url, payload).pipe(
      map(this.mapNewAssignmentTemplate),
    );
  }

  public getAssignment(administratorId: number, assignmentId: string): Observable<NewAssignmentTemplateWithUnitAndParts> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithUnitAndParts>(url).pipe(
      map(this.mapNewAssignmentTemplateWithUnitAndParts),
    );
  }

  public getAssignmentWithInputs(administratorId: number, assignmentId: string): Observable<NewAssignmentTemplateWithUnitAndPartsAndInputs> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithUnitAndPartsAndInputs>(url, { params: { inputs: true } }).pipe(
      map(this.mapNewAssignmentTemplateWithUnitAndPartsAndInputs),
    );
  }

  public saveAssignment(administratorId: number, assignmentId: string, payload: NewAssignmentTemplateSavePayload): Observable<NewAssignmentTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.put<RawNewAssignmentTemplate>(url, payload).pipe(
      map(this.mapNewAssignmentTemplate),
    );
  }

  public deleteAssignment(administratorId: number, assignmentId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newAssignmentTemplates`;
  }

  private readonly mapNewAssignmentTemplate = (assignment: RawNewAssignmentTemplate): NewAssignmentTemplate => {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
    };
  };

  private readonly mapNewAssignmentTemplateWithUnitAndParts = (assignment: RawNewAssignmentTemplateWithUnitAndParts): NewAssignmentTemplateWithUnitAndParts => {
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
  };

  private readonly mapNewAssignmentTemplateWithUnitAndPartsAndInputs = (assignment: RawNewAssignmentTemplateWithUnitAndPartsAndInputs): NewAssignmentTemplateWithUnitAndPartsAndInputs => {
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
        newTextBoxTemplates: p.newTextBoxTemplates.map(t => ({
          ...t,
          created: new Date(t.created),
          modified: t.modified === null ? null : new Date(t.modified),
        })),
        newUploadSlotTemplates: p.newUploadSlotTemplates.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
        })),
        newPartMedia: p.newPartMedia.map(m => ({
          ...m,
          created: new Date(m.created),
          modified: m.modified === null ? null : new Date(m.modified),
        })),
      })),
      newAssignmentMedia: assignment.newAssignmentMedia.map(m => ({
        ...m,
        created: new Date(m.created),
        modified: m.modified === null ? null : new Date(m.modified),
      })),
    };
  };
}
