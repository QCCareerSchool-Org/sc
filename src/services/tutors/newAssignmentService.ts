import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewAssignmentMedium, RawNewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewPartMedium, RawNewPartMedium } from '@/domain/newPartMedium';
import type { NewTextBox, RawNewTextBox } from '@/domain/newTextBox';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/newUploadSlot';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewAssignmentWithUnitAndChildren = NewAssignment & {
  newUnit: Omit<NewUnit, 'complete' | 'points' | 'mark'> & {
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
  newUnit: Omit<RawNewUnit, 'complete' | 'points' | 'mark'> & {
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
  getAssignment: (tutorId: number, studentId: number, unitId: string, assignmentId: string) => Observable<NewAssignmentWithUnitAndChildren>;
}

export class NewAssignmentService implements INewAssignmentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getAssignment(tutorId: number, studentId: number, unitId: string, assignmentId: string): Observable<NewAssignmentWithUnitAndChildren> {
    const url = `${this.getUrl(tutorId, studentId, unitId)}/${assignmentId}`;
    return this.httpService.get<RawNewAssignmentWithUnitAndChildren>(url).pipe(
      map(this.mapNewAssignmentWithUnitAndChildren),
    );
  }

  private getUrl(tutorId: number, studentId: number, unitId: string): string {
    return `${endpoint}/tutors/${tutorId}/students/${studentId}/newUnits/${unitId}/assignments`;
  }

  private readonly mapNewAssignmentWithUnitAndChildren = (newAssignment: RawNewAssignmentWithUnitAndChildren): NewAssignmentWithUnitAndChildren => {
    return {
      ...newAssignment,
      created: new Date(newAssignment.created),
      modified: newAssignment.modified === null ? null : new Date(newAssignment.modified),
      newUnit: {
        ...newAssignment.newUnit,
        submitted: newAssignment.newUnit.submitted === null ? null : new Date(newAssignment.newUnit.submitted),
        skipped: newAssignment.newUnit.skipped === null ? null : new Date(newAssignment.newUnit.skipped),
        transferred: newAssignment.newUnit.transferred === null ? null : new Date(newAssignment.newUnit.transferred),
        marked: newAssignment.newUnit.marked === null ? null : new Date(newAssignment.newUnit.marked),
        created: new Date(newAssignment.newUnit.created),
        modified: newAssignment.newUnit.modified === null ? null : new Date(newAssignment.newUnit.modified),
        enrollment: {
          ...newAssignment.newUnit.enrollment,
          enrollmentDate: newAssignment.newUnit.enrollment.enrollmentDate === null ? null : new Date(newAssignment.newUnit.enrollment.enrollmentDate),
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
