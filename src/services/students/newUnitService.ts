import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Enrollment, RawEnrollment } from '@/domain/enrollment';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewPart, RawNewPart } from '@/domain/newPart';
import type { NewTextBox, RawNewTextBox } from '@/domain/newTextBox';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { NewUploadSlot, RawNewUploadSlot } from '@/domain/newUploadSlot';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type NewUnitWithCourseAndChildren = NewUnit & {
  enrollment: Enrollment;
  newAssignments: Array<NewAssignment & {
    newParts: Array<NewPart & {
      newTextBoxes: NewTextBox[];
      newUploadSlots: NewUploadSlot[];
    }>;
  }>;
};

type RawNewUnitWithCourseAndChildren = RawNewUnit & {
  enrollment: RawEnrollment;
  newAssignments: Array<RawNewAssignment & {
    newParts: Array<RawNewPart & {
      newTextBoxes: RawNewTextBox[];
      newUploadSlots: RawNewUploadSlot[];
    }>;
  }>;
};

export interface INewUnitService {
  initializeNextUnit: (studentId: number, courseId: number) => Observable<NewUnit>;
  getUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnitWithCourseAndChildren>;
  submitUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnit>;
  skipUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnit>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public initializeNextUnit(studentId: number, courseId: number): Observable<NewUnit> {
    const url = `${this.getBaseUrl(studentId, courseId)}/initializeNext`;
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public getUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnitWithCourseAndChildren> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${unitId}`;
    return this.httpService.get<RawNewUnitWithCourseAndChildren>(url).pipe(
      map(this.mapNewUnitWithCourseAndChildren),
    );
  }

  public submitUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnit> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${unitId}/submissions`;
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public skipUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnit> {
    const url = `${this.getBaseUrl(studentId, courseId)}/${unitId}/skips`;
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  private getBaseUrl(studentId: number, courseId: number): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newUnits`;
  }

  private readonly mapNewUnit = (newUnit: RawNewUnit): NewUnit => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
    };
  };

  private readonly mapNewUnitWithCourseAndChildren = (newUnit: RawNewUnitWithCourseAndChildren): NewUnitWithCourseAndChildren => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
      enrollment: {
        ...newUnit.enrollment,
        enrollmentDate: newUnit.enrollment.enrollmentDate === null ? null : new Date(newUnit.enrollment.enrollmentDate),
      },
      newAssignments: newUnit.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
        newParts: a.newParts.map(p => ({
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
      })),
    };
  };
}
