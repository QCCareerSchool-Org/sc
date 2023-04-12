import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { NewTextBoxTemplate, RawNewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewTextBoxTemplateAddPayload = {
  partId: string;
  description: string | null;
  points: number;
  lines: number | null;
  order: number;
  optional: boolean;
};

export type NewTextBoxTemplateSavePayload = {
  description: string | null;
  points: number;
  lines: number | null;
  order: number;
  optional: boolean;
};

type RawNewTextBoxTemplateWithPart = RawNewTextBoxTemplate & {
  newPartTemplate: RawNewPartTemplate;
};

export type NewTextBoxTemplateWithPart = NewTextBoxTemplate & {
  newPartTemplate: NewPartTemplate;
};

export interface INewTextBoxTemplateService {
  addTextBox: (administratorId: number, payload: NewTextBoxTemplateAddPayload) => Observable<NewTextBoxTemplate>;
  getTextBox: (administratorId: number, textBoxId: string) => Observable<NewTextBoxTemplateWithPart>;
  saveTextBox: (administratorId: number, textBoxId: string, payload: NewTextBoxTemplateSavePayload) => Observable<NewTextBoxTemplate>;
  deleteTextBox: (administratorId: number, textBoxId: string) => Observable<void>;
}

export class NewTextBoxTemplateService implements INewTextBoxTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addTextBox(administratorId: number, payload: NewTextBoxTemplateAddPayload): Observable<NewTextBoxTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewTextBoxTemplate>(url, payload).pipe(
      map(this.mapNewTextBoxTemplate),
    );
  }

  public getTextBox(administratorId: number, textBoxId: string): Observable<NewTextBoxTemplateWithPart> {
    const url = `${this.getBaseUrl(administratorId)}/${textBoxId}`;
    return this.httpService.get<RawNewTextBoxTemplateWithPart>(url).pipe(
      map(this.mapNewTextBoxTemplateWithPart),
    );
  }

  public saveTextBox(administratorId: number, textBoxId: string, payload: NewTextBoxTemplateSavePayload): Observable<NewTextBoxTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${textBoxId}`;
    return this.httpService.put<RawNewTextBoxTemplate>(url, payload).pipe(
      map(this.mapNewTextBoxTemplate),
    );
  }

  public deleteTextBox(administratorId: number, textBoxId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${textBoxId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newTextBoxTemplates`;
  }

  private readonly mapNewTextBoxTemplate = (textBox: RawNewTextBoxTemplate): NewTextBoxTemplate => {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
    };
  };

  private readonly mapNewTextBoxTemplateWithPart = (textBox: RawNewTextBoxTemplateWithPart): NewTextBoxTemplateWithPart => {
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
