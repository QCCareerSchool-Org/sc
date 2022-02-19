import { endpoint } from '../../basePath';
import { HttpResponse, IHttpService } from '../httpService';
import type { NewAssignment, NewUnit } from '@/domain/students';

type Data = NewUnit & {
  assignments: Array<NewAssignment>;
};

export interface INewUnitService {
  getUnit: (studentId: number, unitId: string) => Promise<HttpResponse<Data>>;
  submitUnit: (studentId: number, unitId: string) => Promise<HttpResponse<Data>>;
  skipUnit: (studentId: number, unitId: string) => Promise<HttpResponse<Data>>;
}

export class NewUnitService implements INewUnitService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public async getUnit(studentId: number, unitId: string): Promise<HttpResponse<Data>> {
    const url = this.getBaseUrl(studentId, unitId);
    return this.httpService.get<Data>(url);
  }

  public async submitUnit(studentId: number, unitId: string): Promise<HttpResponse<Data>> {
    const url = this.getBaseUrl(studentId, unitId) + '/submissions';
    return this.httpService.post<Data>(url, {});
  }

  public async skipUnit(studentId: number, unitId: string): Promise<HttpResponse<Data>> {
    const url = this.getBaseUrl(studentId, unitId) + '/skips';
    return this.httpService.post<Data>(url, {});
  }

  private getBaseUrl(studentId: number, unitId: string): string {
    return `${endpoint}/students/${studentId}/newUnits/${unitId}`;
  }
}
