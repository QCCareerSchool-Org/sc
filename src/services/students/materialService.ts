import type { Observable } from 'rxjs';

import { endpoint } from '../../basePath';
import type { Material, RawMaterial } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { IHttpService } from '@/services/httpService';

export interface IMaterialService {
  insertMaterialCompletion: (studentId: number, enrollmentId: number, materialId: string) => Observable<MaterialCompletion>;
  deleteMaterialCompletion: (studentId: number, enrollmentId: number, materialId: string) => Observable<void>;
}

export class MaterialService implements IMaterialService {

  public constructor(private readonly httpService: IHttpService) { /* empty */ }

  public insertMaterialCompletion(studentId: number, enrollmentId: number, materialId: string): Observable<MaterialCompletion> {
    const url = `${this.getBaseUrl(studentId, enrollmentId)}/${materialId}/materialCompletions`;
    return this.httpService.post<MaterialCompletion>(url);
  }

  public deleteMaterialCompletion(studentId: number, enrollmentId: number, materialId: string): Observable<void> {
    const url = `${this.getBaseUrl(studentId, enrollmentId)}/${materialId}/materialCompletions`;
    return this.httpService.delete<void>(url);
  }

  private getBaseUrl(studentId: number, enrollmentId: number): string {
    return `${endpoint}/students/${studentId}/enrollments/${enrollmentId}/materials`;
  }

  private readonly mapMaterial = (raw: RawMaterial): Material => {
    return {
      ...raw,
      created: new Date(raw.created),
      modified: raw.modified === null ? null : new Date(raw.modified),
    };
  };
}
