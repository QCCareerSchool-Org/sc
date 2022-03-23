import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewPartTemplate, RawNewPartTemplate } from '@/domain/newPartTemplate';
import type { IHttpService, ProgressResponse } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewPartMediumAddPayload = {
  caption: string;
  order: number;
} & ({
  sourceData: 'file upload';
  file: File;
} | {
  sourceData: 'url';
  externalData: string;
});

export type NewPartMediumEditPayload = {
  caption: string;
  order: number;
};

type RawNewPartMediumWithPart = RawNewPartMedium & {
  newPartTemplate: RawNewPartTemplate;
  newParts: Omit<RawNewPart, 'complete' | 'points' | 'mark'>[];
};

export type NewPartMediumWithPart = NewPartMedium & {
  newPartTemplate: NewPartTemplate;
  newParts: Omit<NewPart, 'complete' | 'points' | 'mark'>[];
};

export interface INewPartMediumService {
  addPartMedium: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewPartMediumAddPayload) => Observable<ProgressResponse<NewPartMedium>>;
  getPartMedium: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string) => Observable<NewPartMediumWithPart>;
  savePartMedium: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string, payload: NewPartMediumEditPayload) => Observable<NewPartMedium>;
  deletePartMedium: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string) => Observable<void>;
}

export class NewPartMediumService implements INewPartMediumService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addPartMedium(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, payload: NewPartMediumAddPayload): Observable<ProgressResponse<NewPartMedium>> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId);
    let body: FormData | NewPartMediumAddPayload;
    let headers: Record<string, string>;
    if (payload.sourceData === 'file upload') {
      body = new FormData();
      body.append('caption', payload.caption);
      body.append('order', payload.order.toString());
      body.append('file', payload.file);
      headers = { 'Content-Type': 'multipart/form-data' };
    } else if (payload.sourceData === 'url') {
      body = payload;
      headers = {};
    } else {
      throw Error('Invalid payload');
    }
    return this.httpService.postFile<RawNewPartMedium>(url, body, { headers }).pipe(
      map(response => {
        if (response.type === 'progress') {
          return response;
        }
        return { type: 'data', value: this.mapNewPartMedium(response.value) };
      }),
    );
  }

  public getPartMedium(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string): Observable<NewPartMediumWithPart> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${mediumId}`;
    return this.httpService.get<RawNewPartMediumWithPart>(url).pipe(
      map(this.mapNewPartMediumWithAssignment),
    );
  }

  public savePartMedium(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string, payload: NewPartMediumEditPayload): Observable<NewPartMedium> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${mediumId}`;
    return this.httpService.put<RawNewPartMedium>(url, payload).pipe(
      map(this.mapNewPartMedium),
    );
  }

  public deletePartMedium(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${mediumId}`;
    return this.httpService.delete<void>(url);
  }

  public downloadPartMediumFile(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, mediumId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId)}/${mediumId}/file`;
    return this.httpService.download(url);
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}/media`;
  }

  private readonly mapNewPartMedium = (medium: RawNewPartMedium): NewPartMedium => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
    };
  };

  private readonly mapNewPartMediumWithAssignment = (medium: RawNewPartMediumWithPart): NewPartMediumWithPart => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
      newPartTemplate: {
        ...medium.newPartTemplate,
        created: new Date(medium.newPartTemplate.created),
        modified: medium.newPartTemplate.modified === null ? null : new Date(medium.newPartTemplate.modified),
      },
      newParts: medium.newParts.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
      })),
    };
  };
}
