import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewUploadSlotTemplate, RawNewUploadSlotTemplate } from '@/domain/newUploadSlotTemplate';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewUploadSlotTemplateAddPayload = {
  partId: string;
  label: string;
  allowedTypes: NewUploadSlotAllowedType[];
  points: number;
  order: number;
  optional: boolean;
};

export type NewUploadSlotTemplateSavePayload = {
  label: string;
  allowedTypes: NewUploadSlotAllowedType[];
  points: number;
  order: number;
  optional: boolean;
};

type RawNewUploadSlotTemplateWithPart = RawNewUploadSlotTemplate & {
  newPartTemplate: RawNewPartTemplate;
};

export type NewUploadSlotTemplateWithPart = NewUploadSlotTemplate & {
  newPartTemplate: NewPartTemplate;
};

export type NewUploadSlotAllowedType = 'image' | 'pdf' | 'word' | 'excel';

export interface INewUploadSlotTemplateService {
  addUploadSlot: (administratorId: number, payload: NewUploadSlotTemplateAddPayload) => Observable<NewUploadSlotTemplate>;
  getUploadSlot: (administratorId: number, uploadSlotId: string) => Observable<NewUploadSlotTemplateWithPart>;
  saveUploadSlot: (administratorId: number, uploadSlotId: string, payload: NewUploadSlotTemplateSavePayload) => Observable<NewUploadSlotTemplate>;
  deleteUploadSlot: (administratorId: number, uploadSlotId: string) => Observable<void>;
}

export class NewUploadSlotTemplateService implements INewUploadSlotTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addUploadSlot(administratorId: number, payload: NewUploadSlotTemplateAddPayload): Observable<NewUploadSlotTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewUploadSlotTemplate>(url, payload).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public getUploadSlot(administratorId: number, uploadSlotId: string): Observable<NewUploadSlotTemplateWithPart> {
    const url = `${this.getBaseUrl(administratorId)}/${uploadSlotId}`;
    return this.httpService.get<RawNewUploadSlotTemplateWithPart>(url).pipe(
      map(this.mapNewParTemplateWithPart),
    );
  }

  public saveUploadSlot(administratorId: number, uploadSlotId: string, payload: NewUploadSlotTemplateSavePayload): Observable<NewUploadSlotTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${uploadSlotId}`;
    return this.httpService.put<RawNewUploadSlotTemplate>(url, payload).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public deleteUploadSlot(administratorId: number, uploadSlotId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${uploadSlotId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newUploadSlotTemplates`;
  }

  private readonly mapNewParTemplate = (textBox: RawNewUploadSlotTemplate): NewUploadSlotTemplate => {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
    };
  };

  private readonly mapNewParTemplateWithPart = (textBox: RawNewUploadSlotTemplateWithPart): NewUploadSlotTemplateWithPart => {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
      newPartTemplate: {
        ...textBox.newPartTemplate,
        created: new Date(textBox.newPartTemplate.created),
        modified: textBox.newPartTemplate.modified === null ? null : new Date(textBox.newPartTemplate.modified),
      },
    };
  };
}
