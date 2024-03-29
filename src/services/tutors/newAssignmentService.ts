import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewAssignment, RawNewAssignment } from '@/domain/tutor/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/tutor/newPart';
import type { NewSubmission, RawNewSubmission } from '@/domain/tutor/newSubmission';
import type { NewTextBox, RawNewTextBox } from '@/domain/tutor/newTextBox';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/tutor/newUploadSlot';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewAssignmentWithUnitAndChildren = NewAssignment & {
  newSubmission: Omit<NewSubmission, 'complete' | 'points' | 'mark'> & {
    enrollment: Enrollment;
  };
  newParts: Array<NewPart & {
    newTextBoxes: NewTextBox[];
    newUploadSlots: NewUploadSlot[];
    newPartMedia: NewPartMedium[];
  }>;
  newAssignmentMedia: NewAssignmentMedium[];
};

type RawNewAssignmentWithUnitAndChildren = RawNewAssignment & {
  newSubmission: Omit<RawNewSubmission, 'complete' | 'points' | 'mark'> & {
    enrollment: RawEnrollment;
  };
  newParts: Array<RawNewPart & {
    newTextBoxes: RawNewTextBox[];
    newUploadSlots: RawNewUploadSlot[];
    newPartMedia: RawNewPartMedium[];
  }>;
  newAssignmentMedia: RawNewAssignmentMedium[];
};

export interface INewAssignmentService {
  getAssignment: (tutorId: number, studentId: number, submissionId: string, assignmentId: string) => Observable<NewAssignmentWithUnitAndChildren>;
  saveTextBox: (tutorId: number, textBoxId: string, mark: number | null, notes: string | null) => Observable<NewTextBox>;
  saveUploadSlot: (tutorId: number, uploadSlotId: string, mark: number | null, notes: string | null) => Observable<NewUploadSlot>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(tutorId: number, studentId: number, submissionId: string, assignmentId: string): Observable<NewAssignmentWithUnitAndChildren> {
    const url = `${this.getUrl(tutorId, studentId, submissionId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentWithUnitAndChildren>(url).pipe(
      map(this.mapNewAssignmentWithUnitAndChildren),
    );
  }

  public saveTextBox(tutorId: number, textBoxId: string, mark: number | null, notes: string | null): Observable<NewTextBox> {
    const url = `${endpoint}/tutors/${tutorId}/newTextBoxes/${textBoxId}`;
    return this.httpService.patch<RawNewTextBox>(url, { mark, notes }).pipe(
      map(raw => ({
        ...raw,
        created: new Date(raw.created),
        modified: raw.modified === null ? null : new Date(raw.modified),
      })),
    );
  }

  public saveUploadSlot(tutorId: number, uploadSlotId: string, mark: number | null, notes: string | null): Observable<NewUploadSlot> {
    const url = `${endpoint}/tutors/${tutorId}/newUploadSlots/${uploadSlotId}`;
    return this.httpService.patch<RawNewUploadSlot>(url, { mark, notes }).pipe(
      map(raw => ({
        ...raw,
        created: new Date(raw.created),
        modified: raw.modified === null ? null : new Date(raw.modified),
      })),
    );
  }

  private getUrl(tutorId: number, studentId: number, submissionId: string): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}/newSubmissions/${submissionId}/assignments`;
  }

  private readonly mapNewAssignmentWithUnitAndChildren = (newAssignment: RawNewAssignmentWithUnitAndChildren): NewAssignmentWithUnitAndChildren => {
    return {
      ...newAssignment,
      created: new Date(newAssignment.created),
      modified: newAssignment.modified === null ? null : new Date(newAssignment.modified),
      newSubmission: {
        ...newAssignment.newSubmission,
        submitted: newAssignment.newSubmission.submitted === null ? null : new Date(newAssignment.newSubmission.submitted),
        transferred: newAssignment.newSubmission.transferred === null ? null : new Date(newAssignment.newSubmission.transferred),
        closed: newAssignment.newSubmission.closed === null ? null : new Date(newAssignment.newSubmission.closed),
        created: new Date(newAssignment.newSubmission.created),
        modified: newAssignment.newSubmission.modified === null ? null : new Date(newAssignment.newSubmission.modified),
        enrollment: {
          ...newAssignment.newSubmission.enrollment,
          enrollmentDate: newAssignment.newSubmission.enrollment.enrollmentDate === null ? null : new Date(newAssignment.newSubmission.enrollment.enrollmentDate),
          dueDate: newAssignment.newSubmission.enrollment.dueDate === null ? null : new Date(newAssignment.newSubmission.enrollment.dueDate),
        },
      },
      newAssignmentMedia: newAssignment.newAssignmentMedia.map(m => ({
        ...m,
        created: new Date(m.created),
        modified: m.modified === null ? null : new Date(m.modified),
      })),
      newParts: newAssignment.newParts.map(p => ({
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
        newPartMedia: p.newPartMedia.map(m => ({
          ...m,
          created: new Date(m.created),
          modified: m.modified === null ? null : new Date(m.modified),
        })),
      })),
    };
  };
}
