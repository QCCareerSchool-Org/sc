import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Course } from '@/domain/course';
import type { NewAssignment, RawNewAssignment } from '@/domain/newAssignment';
import type { NewUnit, RawNewUnit } from '@/domain/newUnit';
import type { IHttpService } from '@/services/httpService';

export type NewUnitWithCourseAndAssignments = NewUnit & {
  course: Course;
  newAssignments: NewAssignment[];
};

type RawNewUnitWithCourseAndAssignments = RawNewUnit & {
  course: Course;
  newAssignments: RawNewAssignment[];
};

export interface INewUnitService {
  getUnit: (administratorId: number, studentId: number, enrollmentId: number, unitId: string) => Observable<NewUnitWithCourseAndAssignments>;
  restartUnit: (administratorId: number, studentId: number, enrollmentId: number, unitId: string) => Observable<NewUnit>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getUnit(administratorId: number, studentId: number, enrollmentId: number, unitId: string): Observable<NewUnitWithCourseAndAssignments> {
    const url = `${this.getUrl(administratorId, studentId, enrollmentId)}/${unitId}`;
    return this.httpService.get<RawNewUnitWithCourseAndAssignments>(url).pipe(
      map(this.mapNewUnitWithCourseAndAssignments),
    );
  }

  public restartUnit(administratorId: number, studentId: number, enrollmentId: number, unitId: string): Observable<NewUnit> {
    const url = `${this.getUrl(administratorId, studentId, enrollmentId)}/${unitId}/restarts`;
    return this.httpService.post<RawNewUnit>(url).pipe(
      map(this.mapNewUnit),
    );
  }

  private getUrl(administratorId: number, studentId: number, enrollmentId: number): string {
    return `${endpoint}/administrators/${administratorId}/students/${studentId}/enrollments/${enrollmentId}/newUnits`;
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

  private readonly mapNewUnitWithCourseAndAssignments = (newUnit: RawNewUnitWithCourseAndAssignments): NewUnitWithCourseAndAssignments => {
    return {
      ...newUnit,
      submitted: newUnit.submitted === null ? null : new Date(newUnit.submitted),
      transferred: newUnit.transferred === null ? null : new Date(newUnit.transferred),
      closed: newUnit.closed === null ? null : new Date(newUnit.closed),
      created: new Date(newUnit.created),
      modified: newUnit.modified === null ? null : new Date(newUnit.modified),
      newAssignments: newUnit.newAssignments.map(a => ({
        ...a,
        created: new Date(a.created),
        modified: a.modified === null ? null : new Date(a.modified),
      })),
    };
  };
}
