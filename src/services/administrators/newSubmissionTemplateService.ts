import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Country } from '@/domain/country';
import type { Course } from '@/domain/course';
import type { Currency } from '@/domain/currency';
import type { NewAssignmentTemplate, RawNewAssignmentTemplate } from '@/domain/newAssignmentTemplate';
import type { NewSubmissionTemplate, RawNewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { NewSubmissionTemplatePrice, RawNewSubmissionTemplatePrice } from '@/domain/newSubmissionTemplatePrice';
import type { IHttpService } from '@/services/httpService';

export type NewSubmissionTemplateAddPayload = {
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  order: number;
  optional: boolean;
};

export type NewSubmissionTemplateSavePayload = {
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  order: number;
  optional: boolean;
};

type RawNewSubmissionTemplateWithCourseAndAssignments = RawNewSubmissionTemplate & {
  course: Course;
  newAssignmentTemplates: RawNewAssignmentTemplate[];
  prices: Array<RawNewSubmissionTemplatePrice & { country: Country | null; currency: Currency }>;
};

export type NewSubmissionTemplateWithCourseAndAssignments = NewSubmissionTemplate & {
  course: Course;
  newAssignmentTemplates: NewAssignmentTemplate[];
  prices: Array<NewSubmissionTemplatePrice & { country: Country | null; currency: Currency }>;
};

export interface INewSubmissionTemplateService {
  addSubmission: (administratorId: number, payload: NewSubmissionTemplateAddPayload) => Observable<NewSubmissionTemplate>;
  getSubmission: (administratorId: number, submissionId: string) => Observable<NewSubmissionTemplateWithCourseAndAssignments>;
  saveSubmission: (administratorId: number, submissionId: string, payload: NewSubmissionTemplateSavePayload) => Observable<NewSubmissionTemplate>;
  deleteSubmission: (administratorId: number, submissionId: string) => Observable<void>;
}

export class NewSubmissionTemplateService implements INewSubmissionTemplateService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public addSubmission(administratorId: number, payload: NewSubmissionTemplateAddPayload): Observable<NewSubmissionTemplate> {
    const url = this.getBaseUrl(administratorId);
    return this.httpService.post<RawNewSubmissionTemplate>(url, payload).pipe(
      map(this.mapNewSubmissionTemplate),
    );
  }

  public getSubmission(administratorId: number, submissionId: string): Observable<NewSubmissionTemplateWithCourseAndAssignments> {
    const url = `${this.getBaseUrl(administratorId)}/${submissionId}`;
    return this.httpService.get<RawNewSubmissionTemplateWithCourseAndAssignments>(url).pipe(
      map(this.mapNewSubmissionTemplateWithCourseAndAssignments),
    );
  }

  public saveSubmission(administratorId: number, submissionId: string, payload: NewSubmissionTemplateSavePayload): Observable<NewSubmissionTemplate> {
    const url = `${this.getBaseUrl(administratorId)}/${submissionId}`;
    return this.httpService.put<RawNewSubmissionTemplate>(url, payload).pipe(
      map(this.mapNewSubmissionTemplate),
    );
  }

  public deleteSubmission(administratorId: number, submissionId: string): Observable<void> {
    const url = `${this.getBaseUrl(administratorId)}/${submissionId}`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newSubmissionTemplates`;
  }

  private readonly mapNewSubmissionTemplate = (unit: RawNewSubmissionTemplate): NewSubmissionTemplate => {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
    };
  };

  private readonly mapNewSubmissionTemplateWithCourseAndAssignments = (unit: RawNewSubmissionTemplateWithCourseAndAssignments): NewSubmissionTemplateWithCourseAndAssignments => {
    return {
      ...unit,
      created: new Date(unit.created),
      modified: unit.modified === null ? null : new Date(unit.modified),
      newAssignmentTemplates: unit.newAssignmentTemplates.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
      prices: unit.prices.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
      })),
    };
  };
}
