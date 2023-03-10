import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { NewAssignment, RawNewAssignment } from '@/domain/administrator/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/administrator/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/administrator/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/administrator/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/administrator/newUploadSlot';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium } from '@/domain/newPartMedium';
import type { IHttpService } from '@/services/httpService';

export type NewAssignmentWithChildren = NewAssignment & {
  newSubmission: Omit<NewSubmission, 'complete' | 'points' | 'mark' | 'markOverride'>;
  newParts: Array<NewPart & {
    newTextBoxes: NewTextBox[];
    newUploadSlots: NewUploadSlot[];
    newPartMedia: NewPartMedium[];
  }>;
  newAssignmentMedia: NewAssignmentMedium[];
};

type RawNewAssignmentWithChildren = RawNewAssignment & {
  newSubmission: Omit<RawNewSubmission, 'complete' | 'points' | 'mark' | 'markOverride'>;
  newParts: Array<RawNewPart & {
    newTextBoxes: RawNewTextBox[];
    newUploadSlots: RawNewUploadSlot[];
    newPartMedia: NewPartMedium[];
  }>;
  newAssignmentMedia: NewAssignmentMedium[];
};

export interface INewAssignmentService {
  getAssignment: (administratorId: number, assignmentId: string) => Observable<NewAssignmentWithChildren>;
  saveTextBox: (administratorId: number, textBoxId: string, markOverride: number | null) => Observable<NewTextBox>;
  saveUploadSlot: (administratorId: number, uploadSlotId: string, markOverride: number | null) => Observable<NewUploadSlot>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(administratorId: number, assignmentId: string): Observable<NewAssignmentWithChildren> {
    const url = `${this.getUrl(administratorId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentWithChildren>(url).pipe(
      map(this.mapNewAssignmentWithPartsAndInputs),
    );
  }

  public saveTextBox(administratorId: number, textBoxId: string, markOverride: number | null): Observable<NewTextBox> {
    const url = `${endpoint}/administrators/${administratorId}/newTextBoxes/${textBoxId}`;
    return this.httpService.put<RawNewTextBox>(url, { markOverride }).pipe(
      map(raw => ({
        ...raw,
        created: new Date(raw.created),
        modified: raw.modified === null ? null : new Date(raw.modified),
      })),
    );
  }

  public saveUploadSlot(administratorId: number, uploadSlotId: string, markOverride: number | null): Observable<NewUploadSlot> {
    const url = `${endpoint}/administrators/${administratorId}/newUploadSlots/${uploadSlotId}`;
    return this.httpService.patch<RawNewUploadSlot>(url, { markOverride }).pipe(
      map(raw => ({
        ...raw,
        created: new Date(raw.created),
        modified: raw.modified === null ? null : new Date(raw.modified),
      })),
    );
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newAssignments`;
  }

  private readonly mapNewAssignmentWithPartsAndInputs = (assignment: RawNewAssignmentWithChildren): NewAssignmentWithChildren => {
    return {
      ...assignment,
      created: new Date(assignment.created),
      modified: assignment.modified === null ? null : new Date(assignment.modified),
      newSubmission: {
        ...assignment.newSubmission,
        submitted: assignment.newSubmission.submitted === null ? null : new Date(assignment.newSubmission.submitted),
        transferred: assignment.newSubmission.transferred === null ? null : new Date(assignment.newSubmission.transferred),
        closed: assignment.newSubmission.closed === null ? null : new Date(assignment.newSubmission.closed),
        created: new Date(assignment.newSubmission.created),
        modified: assignment.newSubmission.modified === null ? null : new Date(assignment.newSubmission.modified),
      },
      newParts: assignment.newParts.map(p => ({
        ...p,
        created: new Date(p.created),
        modified: p.modified === null ? null : new Date(p.modified),
        newTextBoxes: p.newTextBoxes.map(t => ({
          ...t,
          created: new Date(t.created),
          modified: t.modified === null ? null : new Date(t.modified),
        })),
        newUploadSlots: p.newUploadSlots.map(u => ({
          ...u,
          created: new Date(u.created),
          modified: u.modified === null ? null : new Date(u.modified),
        })),
      })),
    };
  };
}
