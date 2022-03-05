import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Enrollment, NewAssignment, NewUnit, RawEnrollment, RawNewAssignment, RawNewUnit } from '@/domain/students';

export type NewUnitWithAssignments = NewUnit & {
  enrollment: Enrollment;
  assignments: Array<NewAssignment>;
};

type RawNewUnitWithAssignments = RawNewUnit & {
  enrollment: RawEnrollment;
  assignments: Array<RawNewAssignment>;
};

export interface INewUnitService {
  getUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnitWithAssignments>;
  submitUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnit>;
  skipUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnit>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, courseId, unitId);
    return this.httpService.get<RawNewUnitWithAssignments>(url).pipe(
      map(this.mapNewUnitWithAssignments),
    );
  }

  public submitUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnit> {
    const url = this.getBaseUrl(studentId, courseId, unitId) + '/submissions';
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  public skipUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnit> {
    const url = this.getBaseUrl(studentId, courseId, unitId) + '/skips';
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  private getBaseUrl(studentId: number, courseId: number, unitId: string): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}`;
  }

  private readonly mapNewUnit = (unit: RawNewUnit): NewUnit => {
    return {
      ...unit,
      submitted: unit.submitted === null ? null : new Date(unit.submitted),
      skipped: unit.skipped === null ? null : new Date(unit.skipped),
      transferred: unit.transferred === null ? null : new Date(unit.transferred),
      marked: unit.marked === null ? null : new Date(unit.marked),
      created: new Date(unit.created),
    };
  };

  private readonly mapNewUnitWithAssignments = (unit: RawNewUnitWithAssignments): NewUnitWithAssignments => {
    return {
      ...unit,
      submitted: unit.submitted === null ? null : new Date(unit.submitted),
      skipped: unit.skipped === null ? null : new Date(unit.skipped),
      transferred: unit.transferred === null ? null : new Date(unit.transferred),
      marked: unit.marked === null ? null : new Date(unit.marked),
      created: new Date(unit.created),
      assignments: unit.assignments.map(a => ({
        ...a,
        created: new Date(a.created),
      })),
      enrollment: {
        ...unit.enrollment,
        enrollmentDate: unit.enrollment.enrollmentDate === null ? null : new Date(unit.enrollment.enrollmentDate),
      },
    };
  };
}
