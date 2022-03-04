import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewPartTemplate, NewUploadSlotTemplate, RawNewPartTemplate, RawNewUploadSlotTemplate } from '@/domain/index';

type RawNewUploadSlotTemplateWithPart = RawNewUploadSlotTemplate & {
  part: RawNewPartTemplate;
};

export type NewUploadSlotTemplateWithPart = NewUploadSlotTemplate & {
  part: NewPartTemplate;
};

export type AllowedType = 'image' | 'pdf' | 'word' | 'excel';

export type NewUploadSlotPayload = {
  label: string;
  allowedTypes: AllowedType[];
  points: number;
  order: number;
  optional: boolean;
};

export interface INewUploadSlotTemplateService {
  addUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewUploadSlotPayload) => Observable<NewUploadSlotTemplate>;
  getUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string) => Observable<NewUploadSlotTemplateWithPart>;
  saveUploadSlot: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, payload: NewUploadSlotPayload) => Observable<NewUploadSlotTemplate>;
}

export class NewUploadSlotTemplateService implements INewUploadSlotTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewUploadSlotPayload): Observable<NewUploadSlotTemplate> {
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

  public saveUploadSlot(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, uploadSlotId: string, payload: NewUploadSlotPayload): Observable<NewUploadSlotTemplate> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${uploadSlotId}`;
    return this.httpService.put<RawNewUploadSlotTemplate>(url, payload).pipe(
      map(this.mapNewParTemplate),
    );
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
      part: {
        ...textBox.part,
        created: new Date(textBox.part.created),
        modified: textBox.part.modified === null ? null : new Date(textBox.part.modified),
      },
    };
  }
}
