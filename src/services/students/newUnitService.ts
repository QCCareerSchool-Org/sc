import { map, Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewAssignment, NewUnit, RawNewAssignment, RawNewUnit } from '@/domain/students';
import { Enrollment, RawEnrollment } from '@/domain/students/enrollment';

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
  submitUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnitWithAssignments>;
  skipUnit: (studentId: number, courseId: number, unitId: string) => Observable<NewUnitWithAssignments>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, courseId, unitId);
    return this.httpService.get<RawNewUnitWithAssignments>(url).pipe(
      map(u => this.unitMap(u)),
    );
  }

  public submitUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, courseId, unitId) + '/submissions';
    return this.httpService.post<RawNewUnitWithAssignments>(url).pipe(
      map(u => this.unitMap(u)),
    );
  }

  public skipUnit(studentId: number, courseId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, courseId, unitId) + '/skips';
    return this.httpService.post<RawNewUnitWithAssignments>(url).pipe(
      map(u => this.unitMap(u)),
    );
  }

  private getBaseUrl(studentId: number, courseId: number, unitId: string): string {
    return `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}`;
  }

  private readonly unitMap = (unit: RawNewUnitWithAssignments): NewUnitWithAssignments => {
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
