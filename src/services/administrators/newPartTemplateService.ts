import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignmentTemplate, NewPartTemplate, NewTextBoxTemplate, NewUploadSlotTemplate, RawNewAssignmentTemplate, RawNewPartTemplate, RawNewTextBoxTemplate, RawNewUploadSlotTemplate } from '@/domain/index';

type RawNewPartTemplateWithInputs = RawNewPartTemplate & {
  assignment: RawNewAssignmentTemplate;
  textBoxes: RawNewTextBoxTemplate[];
  uploadSlots: RawNewUploadSlotTemplate[];
};

export type NewPartTemplateWithInputs = NewPartTemplate & {
  assignment: NewAssignmentTemplate;
  textBoxes: NewTextBoxTemplate[];
  uploadSlots: NewUploadSlotTemplate[];
};

export interface INewPartTemplateService {
  getPart: (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string) => Observable<NewPartTemplateWithInputs>;
}

export class NewPartTemplateService implements INewPartTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getPart(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): Observable<NewPartTemplateWithInputs> {
    const url = this.getBaseUrl(administratorId, schoolId, courseId, unitId, assignmentId, partId);
    return this.httpService.get<RawNewPartTemplateWithInputs>(url).pipe(
      map(this.mapNewParTemplate),
    );
  }

  private getBaseUrl(administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string): string {
    return `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}`;
  }

  private mapNewParTemplate(part: RawNewPartTemplateWithInputs): NewPartTemplateWithInputs {
    return {
      ...part,
      created: new Date(part.created),
      modified: part.modified === null ? null : new Date(part.modified),
      assignment: {
        ...part.assignment,
        created: new Date(part.assignment.created),
        modified: part.assignment.modified === null ? null : new Date(part.assignment.modified),
      },
      textBoxes: part.textBoxes.map(t => ({
        ...t,
        created: new Date(t.created),
        modified: t.modified === null ? null : new Date(t.modified),
      })),
      uploadSlots: part.uploadSlots.map(u => ({
        ...u,
        created: new Date(u.created),
        modified: u.modified === null ? null : new Date(u.modified),
      })),
    };
  }
}
