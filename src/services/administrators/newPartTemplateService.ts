import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewDescriptionType } from '@/domain/newDescriptionType';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate, RawNewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { NewUploadSlotTemplate, RawNewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { IHttpService } from '@/services/httpService';

export type NewPartTemplateAddPayload = {
  assignmentId: string;
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
};

export type NewPartTemplateSavePayload = {
  partNumber: number;
  title: string;
  description: string | null;
  descriptionType: NewDescriptionType;
  markingCriteria: string | null;
};

type RawNewPartTemplateWithAssignmentAndInputs = RawNewPartTemplate & {
  newAssignmentTemplate: RawNewAssignmentTemplate;
  newTextBoxTemplates: RawNewTextBoxTemplate[];
  newUploadSlotTemplates: RawNewUploadSlotTemplate[];
  newPartMedia: RawNewPartMedium[];
};

export type NewPartTemplateWithAssignmentAndInputs = NewPartTemplate & {
  newAssignmentTemplate: NewAssignmentTemplate;
  newTextBoxTemplates: NewTextBoxTemplate[];
  newUploadSlotTemplates: NewUploadSlotTemplate[];
  newPartMedia: NewPartMedium[];
};

export interface INewPartTemplateService {
  addPart: (administratorId: number, data: NewPartTemplateAddPayload) => Observable<NewPartTemplate>;
  getPart: (administratorId: number, partId: string) => Observable<NewPartTemplateWithAssignmentAndInputs>;
  savePart: (administratorId: number, partId: string, data: NewPartTemplateSavePayload) => Observable<NewPartTemplate>;
  deletePart: (administratorId: number, partId: string) => Observable<void>;
}

export class NewPartTemplateService implements INewPartTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addPart(administratorId: number, data: NewPartTemplateAddPayload): Observable<NewPartTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewPartTemplate>(url, data).pipe(
      map(this.mapNewPartTemplate),
    );
  }

  public getPart(administratorId: number, partId: string): Observable<NewPartTemplateWithAssignmentAndInputs> {
    const url = `${this.getBaseUrl(administratorId)}/${partId}`;
    return this.httpService.get<RawNewPartTemplateWithAssignmentAndInputs>(url).pipe(
      map(this.mapNewParTemplateWithAssignmentAndInputs),
    );
  }

  public savePart(administratorId: number, partId: string, data: NewPartTemplateSavePayload): Observable<NewPartTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${partId}`;
    return this.httpService.put<RawNewPartTemplate>(url, data).pipe(
      map(this.mapNewPartTemplate),
    );
  }

  public deletePart(administratorId: number, partId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${partId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newPartTemplates`;
  }

  private readonly mapNewPartTemplate = (part: RawNewPartTemplate): NewPartTemplate => {
    return {
      ...part,
      created: new Date(part.created),
      modified: part.modified === null ? null : new Date(part.modified),
    };
  };

  private readonly mapNewParTemplateWithAssignmentAndInputs = (part: RawNewPartTemplateWithAssignmentAndInputs): NewPartTemplateWithAssignmentAndInputs => {
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
      newPartMedia: part.newPartMedia.map(m => ({
        ...m,
        created: new Date(m.created),
        modified: m.modified === null ? null : new Date(m.modified),
      })),
    };
  };
}
