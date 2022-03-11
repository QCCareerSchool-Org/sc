import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService, ProgressResponse } from '../httpService';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';

export type NewAssignmentMediumPayload = {
  caption: string;
  order: number;
} & ({
  sourceData: 'file upload';
  file: File;
} | {
  sourceData: 'url';
  externalData: string;
});

type RawNewAssignmentMediumWithAssingnment = RawNewAssignmentMedium & {
  newAssignmentTemplate: RawNewAssignmentTemplate;
};

export type NewAssignmentMediumWithAssingnment = NewAssignmentMedium & {
  newAssignmentTemplate: NewAssignmentTemplate;
};

export interface INewAssignmentMediumService {
  addAssignmentMedium: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, payload: NewAssignmentMediumPayload) => Observable<ProgressResponse<NewAssignmentMedium>>;
}

export class NewAssignmentMediumService implements INewAssignmentMediumService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addAssignmentMedium(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, payload: NewAssignmentMediumPayload): Observable<ProgressResponse<NewAssignmentMedium>> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId);
    let body: FormData | NewAssignmentMediumPayload;
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
    return this.httpService.postFile<RawNewAssignmentMedium>(url, body, { headers }).pipe(
      map(response => {
        if (response.type === 'progress') {
          return response;
        }
        return {
          type: 'data',
          value: this.mapNewAssignmentMedium(response.value),
        };
      }),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/media`;
  }

  private readonly mapNewAssignmentMedium = (medium: RawNewAssignmentMedium): NewAssignmentMedium => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
    };
  };

  private readonly mapNewAssignmentMediumWithAssignment = (medium: RawNewAssignmentMediumWithAssingnment): NewAssignmentMediumWithAssingnment => {
    return {
      ...medium,
      created: new Date(medium.created),
      modified: medium.modified === null ? null : new Date(medium.modified),
      newAssignmentTemplate: {
        ...medium.newAssignmentTemplate,
        created: new Date(medium.newAssignmentTemplate.created),
        modified: medium.newAssignmentTemplate.modified === null ? null : new Date(medium.newAssignmentTemplate.modified),
      },
    };
  };
}
