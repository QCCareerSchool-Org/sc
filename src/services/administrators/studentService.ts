import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { AdministratorStudent, RawAdministratorStudent } from '@/domain/administrator/student';
import type { Country } from '@/domain/country';
import type { Province } from '@/domain/province';
import type { IHttpService } from '@/services/httpService';

type RawStudentWithCountryAndProvince = RawAdministratorStudent & {
  country: Country;
  province: Province | null;
};

export type StudentWithCountryAndProvince = AdministratorStudent & {
  country: Country;
  province: Province | null;
};

export interface IStudentService {
  getStudent: (administratorId: number, studentId: number) => Observable<StudentWithCountryAndProvince>;
}

export class StudentService implements IStudentService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public getStudent(administratorId: number, studentId: number): Observable<StudentWithCountryAndProvince> {
    const url = `${this.getBaseUrl(administratorId)}/${studentId}`;
    return this.httpService.get<RawStudentWithCountryAndProvince>(url).pipe(
      map(this.mapStudent),
    );
  }

  private getBaseUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/students`;
  }

  private readonly mapStudent = (raw: RawStudentWithCountryAndProvince): StudentWithCountryAndProvince => {
    return {
      ...raw,
      lastLogin: raw.lastLogin === null ? null : new Date(raw.lastLogin),
      expiry: raw.expiry === null ? null : new Date(raw.expiry),
      created: new Date(raw.created),
      modified: new Date(raw.modified),
    };
  };
}
