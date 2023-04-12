import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { NewTextBoxTemplate, RawNewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate, RawNewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewAssignmentTemplateAddPayload = {
  submissionId: string;
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

type RawNewAssignmentTemplateWithSubmissionTemplateAndPartTemplate = RawNewAssignmentTemplate & {
  newSubmissionTemplate: RawNewSubmissionTemplate;
  newPartTemplates: RawNewPartTemplate[];
  newAssignmentMedia: RawNewAssignmentMedium[];
};

export type NewAssignmentTemplateWithSubmissionTemplateAndPartTemplate = NewAssignmentTemplate & {
  newSubmissionTemplate: NewSubmissionTemplate;
  newPartTemplates: NewPartTemplate[];
  newAssignmentMedia: NewAssignmentMedium[];
};

type RawNewAssignmentTemplateWithSubmissionTemplateAndChildren = RawNewAssignmentTemplate & {
  newSubmissionTemplate: RawNewSubmissionTemplate;
  newPartTemplates: Array<RawNewPartTemplate & {
    newTextBoxTemplates: RawNewTextBoxTemplate[];
    newUploadSlotTemplates: RawNewUploadSlotTemplate[];
    newPartMedia: RawNewPartMedium[];
  }>;
  newAssignmentMedia: RawNewAssignmentMedium[];
};

export type NewAssignmentTemplateWithSubmissionTemplateAndChildren = NewAssignmentTemplate & {
  newSubmissionTemplate: NewSubmissionTemplate;
  newPartTemplates: Array<NewPartTemplate & {
    newTextBoxTemplates: NewTextBoxTemplate[];
    newUploadSlotTemplates: NewUploadSlotTemplate[];
    newPartMedia: NewPartMedium[];
  }>;
  newAssignmentMedia: NewAssignmentMedium[];
};

export interface INewAssignmentTemplateService {
  addAssignment: (administratorId: number, payload: NewAssignmentTemplateAddPayload) => Observable<NewAssignmentTemplate>;
  getAssignment: (administratorId: number, assignmentId: string) => Observable<NewAssignmentTemplateWithSubmissionTemplateAndPartTemplate>;
  getAssignmentWithInputs: (administratorId: number, assignmentId: string) => Observable<NewAssignmentTemplateWithSubmissionTemplateAndChildren>;
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

  public getAssignment(administratorId: number, assignmentId: string): Observable<NewAssignmentTemplateWithSubmissionTemplateAndPartTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithSubmissionTemplateAndPartTemplate>(url).pipe(
      map(this.mapNewAssignmentTemplateWithSubmissionTemplateAndPartTemplate),
    );
  }

  public getAssignmentWithInputs(administratorId: number, assignmentId: string): Observable<NewAssignmentTemplateWithSubmissionTemplateAndChildren> {
    const url = `${this.getBaseUrl(administratorId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentTemplateWithSubmissionTemplateAndChildren>(url, { params: { inputs: true } }).pipe(
      map(this.mapNewAssignmentTemplateWithSubmissionTemplateAndChildren),
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

  private readonly mapNewAssignmentTemplateWithSubmissionTemplateAndPartTemplate = (assignment: RawNewAssignmentTemplateWithSubmissionTemplateAndPartTemplate): NewAssignmentTemplateWithSubmissionTemplateAndPartTemplate => {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
      newSubmissionTemplate: {
        ...assignment.newSubmissionTemplate,
        created: new Date(assignment.newSubmissionTemplate.created),
        modified: assignment.newSubmissionTemplate.modified === null ? null : new Date(assignment.newSubmissionTemplate.modified),
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

  private readonly mapNewAssignmentTemplateWithSubmissionTemplateAndChildren = (assignment: RawNewAssignmentTemplateWithSubmissionTemplateAndChildren): NewAssignmentTemplateWithSubmissionTemplateAndChildren => {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
      newSubmissionTemplate: {
        ...assignment.newSubmissionTemplate,
        created: new Date(assignment.newSubmissionTemplate.created),
        modified: assignment.newSubmissionTemplate.modified === null ? null : new Date(assignment.newSubmissionTemplate.modified),
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
