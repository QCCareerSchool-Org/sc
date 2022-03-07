import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewPartTemplate, NewUploadSlotTemplate, RawNewPartTemplate, RawNewUploadSlotTemplate } from '@/domain/index';

type RawNewUploadSlotTemplateWithPart = RawNewUploadSlotTemplate & {
  newPartTemplate: RawNewPartTemplate;
};

export type NewUploadSlotTemplateWithPart = NewUploadSlotTemplate & {
  newPartTemplate: NewPartTemplate;
};

export type AllowedType = 'image' | 'pdf' | 'word' | 'excel';

export type NewUploadSlotTemplatePayload = {
  label: string;
  allowedTypes: AllowedType[];
  points: number;
  order: number;
  optional: boolean;
};

export interface INewUploadSlotTemplateService {
  addUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewUploadSlotTemplatePayload) => Observable<NewUploadSlotTemplate>;
  getUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<NewUploadSlotTemplateWithPart>;
  saveUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, payload: NewUploadSlotTemplatePayload) => Observable<NewUploadSlotTemplate>;
  deleteUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string) => Observable<void>;
}

export class NewUploadSlotTemplateService implements INewUploadSlotTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewUploadSlotTemplatePayload): Observable<NewUploadSlotTemplate> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId);
    return this.httpService.post<RawNewUploadSlotTemplate>(url, payload).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public getUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<NewUploadSlotTemplateWithPart> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${uploadSlotId}`;
    return this.httpService.get<RawNewUploadSlotTemplateWithPart>(url).pipe(
      map(this.mapNewParTemplateWithPart),
    );
  }

  public saveUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, payload: NewUploadSlotTemplatePayload): Observable<NewUploadSlotTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${uploadSlotId}`;
    return this.httpService.put<RawNewUploadSlotTemplate>(url, payload).pipe(
      map(this.mapNewParTemplate),
    );
  }

  public deleteUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${uploadSlotId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}/uploadSlots`;
  }

  private mapNewParTemplate(textBox: RawNewUploadSlotTemplate): NewUploadSlotTemplate {
    return {
      ...textBox,
      created: new Date(textBox.created),
      modified: textBox.modified === null ? null : new Date(textBox.modified),
    };
  }

  private mapNewParTemplateWithPart(textBox: RawNewUploadSlotTemplateWithPart): NewUploadSlotTemplateWithPart {
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
  }
}
