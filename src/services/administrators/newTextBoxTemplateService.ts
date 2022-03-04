import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewPartTemplate, NewTextBoxTemplate, RawNewPartTemplate, RawNewTextBoxTemplate } from '@/domain/index';

type RawNewTextBoxTemplateWithPart = RawNewTextBoxTemplate & {
  part: RawNewPartTemplate;
};

export type NewTextBoxTemplateWithPart = NewTextBoxTemplate & {
  part: NewPartTemplate;
};

export type NewTextBoxPayload = {
  description: string | null;
  points: number;
  lines: number | null;
  order: number;
  optional: boolean;
};

export interface INewTextBoxTemplateService {
  addTextBox: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewTextBoxPayload) => Observable<NewTextBoxTemplate>;
  getTextBox: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string) => Observable<NewTextBoxTemplateWithPart>;
  saveTextBox: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, payload: NewTextBoxPayload) => Observable<NewTextBoxTemplate>;
  deleteTextBox: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string) => Observable<void>;
}

export class NewTextBoxTemplateService implements INewTextBoxTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addTextBox(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewTextBoxPayload): Observable<NewTextBoxTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId);
    return this.httpService.post<RawNewTextBoxTemplate>(url, payload).pipe(
      map(this.mapNewTextBoxTemplate),
    );
  }

  public getTextBox(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string): Observable<NewTextBoxTemplateWithPart> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${textBoxId}`;
    return this.httpService.get<RawNewTextBoxTemplateWithPart>(url).pipe(
      map(this.mapNewTextBoxTemplateWithPart),
    );
  }

  public saveTextBox(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, payload: NewTextBoxPayload): Observable<NewTextBoxTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${textBoxId}`;
    return this.httpService.put<RawNewTextBoxTemplate>(url, payload).pipe(
      map(this.mapNewTextBoxTemplate),
    );
  }

  public deleteTextBox(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${textBoxId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}/textBoxes`;
  }

  private mapNewTextBoxTemplate(textBox: RawNewTextBoxTemplate): NewTextBoxTemplate {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
    };
  }

  private mapNewTextBoxTemplateWithPart(textBox: RawNewTextBoxTemplateWithPart): NewTextBoxTemplateWithPart {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
      part: {
        ...textBox.part,
        created: new Date(textBox.part.created),
        modified: textBox.part.modified === null ? null : new Date(textBox.part.modified),
      },
    };
  }
}
