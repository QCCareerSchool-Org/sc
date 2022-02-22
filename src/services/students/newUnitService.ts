import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IObservableHttpService } from '../observableHttpService';
import type { NewAssignment, NewUnit } from '@/domain/students';

export type NewUnitWithAssignments = NewUnit & {
  assignments: Array<NewAssignment>;
};

export interface INewUnitService {
  getUnit: (studentId: number, unitId: string) => Observable<NewUnitWithAssignments>;
  submitUnit: (studentId: number, unitId: string) => Observable<NewUnitWithAssignments>;
  skipUnit: (studentId: number, unitId: string) => Observable<NewUnitWithAssignments>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IObservableHttpService) { /* empty */ }

  public getUnit(studentId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, unitId);
    return this.httpService.get<NewUnitWithAssignments>(url);
  }

  public submitUnit(studentId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, unitId) + '/submissions';
    return this.httpService.post<NewUnitWithAssignments>(url, {});
  }

  public skipUnit(studentId: number, unitId: string): Observable<NewUnitWithAssignments> {
    const url = this.getBaseUrl(studentId, unitId) + '/skips';
    return this.httpService.post<NewUnitWithAssignments>(url, {});
  }

  private getBaseUrl(studentId: number, unitId: string): string {
    return `${endpoint}/students/${studentId}/newUnits/${unitId}`;
  }
}
