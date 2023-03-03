import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/administrator/newAssignment';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { IHttpService, ProgressResponse } from '@/services/httpService';

type FileUploadOrURL =
  | { sourceData: 'file upload'; file: File }
  | { sourceData: 'url'; externalData: string };

export type NewAssignmentMediumAddPayload = {
  assignmentId: string;
  caption: string;
  order: number;
} & FileUploadOrURL;

export type NewAssignmentMediumSavePayload = {
  caption: string;
  order: number;
};

type RawNewAssignmentMediumWithAssignnment = RawNewAssignmentMedium & {
  newAssignmentTemplate: RawNewAssignmentTemplate;
  newAssignments: Omit<RawNewAssignment, 'complete' | 'points' | 'mark'>[];
};

export type NewAssignmentMediumWithAssignnment = NewAssignmentMedium & {
  newAssignmentTemplate: NewAssignmentTemplate;
  newAssignments: Omit<NewAssignment, 'complete' | 'points' | 'mark'>[];
};

export interface INewAssignmentMediumService {
  addAssignmentMedium: (administratorId: number, payload: NewAssignmentMediumAddPayload) => Observable<ProgressResponse<NewAssignmentMedium>>;
  getAssignmentMedium: (administratorId: number, mediumId: string) => Observable<NewAssignmentMediumWithAssignnment>;
  saveAssignmentMedium: (administratorId: number, mediumId: string, payload: NewAssignmentMediumSavePayload) => Observable<NewAssignmentMedium>;
  deleteAssignmentMedium: (administratorId: number, mediumId: string) => Observable<void>;
  downloadAssignmentMediumFile: (administratorId: number, mediumId: string) => Observable<void>;
}

export class NewAssignmentMediumService implements INewAssignmentMediumService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addAssignmentMedium(administratorId: number, payload: NewAssignmentMediumAddPayload): Observable<ProgressResponse<NewAssignmentMedium>> {
    const url = this.getBaseUrl(administratorId);
    let body: FormData | NewAssignmentMediumAddPayload;
    let headers: Record<string, string>;
    if (payload.sourceData === 'file upload') {
      body = new FormData();
      body.append('assignmentId', payload.assignmentId);
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
    return this.httpService.postFile<RawNewAssignmentMedium>(url, body, { headers }).pipe(
      map(response => {
        if (response.type === 'progress') {
          return response;
        }
        return { type: 'data', value: this.mapNewAssignmentMedium(response.value) };
      }),
    );
  }

  public getAssignmentMedium(administratorId: number, mediumId: string): Observable<NewAssignmentMediumWithAssignnment> {
    const url = `${this.getBaseUrl(administratorId)}/${mediumId}`;
    return this.httpService.get<RawNewAssignmentMediumWithAssignnment>(url).pipe(
      map(this.mapNewAssignmentMediumWithAssignment),
    );
  }

  public saveAssignmentMedium(administratorId: number, mediumId: string, payload: NewAssignmentMediumSavePayload): Observable<NewAssignmentMedium> {
    const url = `${this.getBaseUrl(administratorId)}/${mediumId}`;
    return this.httpService.put<RawNewAssignmentMedium>(url, payload).pipe(
      map(this.mapNewAssignmentMedium),
    );
  }

  public deleteAssignmentMedium(administratorId: number, mediumId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${mediumId}`;
    return this.httpService.delete<void>(url);
  }

  public downloadAssignmentMediumFile(administratorId: number, mediumId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${mediumId}/file`;
    return this.httpService.download(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newAssignmentMedia`;
  }

  private readonly mapNewAssignmentMedium = (medium: RawNewAssignmentMedium): NewAssignmentMedium => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
    };
  };

  private readonly mapNewAssignmentMediumWithAssignment = (medium: RawNewAssignmentMediumWithAssignnment): NewAssignmentMediumWithAssignnment => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
      newAssignmentTemplate: {
        ...medium.newAssignmentTemplate,
        created: new Date(medium.newAssignmentTemplate.created),
        modified: medium.newAssignmentTemplate.modified === null ? null : new Date(medium.newAssignmentTemplate.modified),
      },
      newAssignments: medium.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  };
}
