import { map, type Observable } from 'rxjs';

import type { Material, RawMaterial } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { IHttpService } from '@/services/httpService';
import { endpoint } from 'src/basePath';

type MaterialWithData = Material & {
  materialData: Record<string, string>;
};

type RawMaterialWithData = RawMaterial & {
  materialData: Record<string, string>;
};

export interface IMaterialService {
  insertMaterialCompletion: (studentId: number, enrollmentId: number, materialId: string) => Observable<MaterialCompletion>;
  deleteMaterialCompletion: (studentId: number, enrollmentId: number, materialId: string) => Observable<void>;
  getMaterial: (studentId: number, materialId: string) => Observable<MaterialWithData>;
  updateMaterialData: (studentId: number, materialId: string, data: Record<string, string>) => Observable<void>;
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

  public getMaterial(studentId: number, materialId: string): Observable<MaterialWithData> {
    const url = `${endpoint}/students/${studentId}/materials/${materialId}`;
    return this.httpService.get<RawMaterialWithData>(url).pipe(map(this.mapMaterialWithData));
  }

  public updateMaterialData(studentId: number, materialId: string, data: Record<string, string>): Observable<void> {
    const url = `${endpoint}/students/${studentId}/materials/${materialId}/data`;
    return this.httpService.post<void>(url, data);
  }

  private getBaseUrl(studentId: number, enrollmentId: number): string {
    return `${endpoint}/students/${studentId}/enrollments/${enrollmentId}/materials`;
  }

  private readonly mapMaterialWithData = (raw: RawMaterialWithData): MaterialWithData => {
    return {
      ...raw,
      created: new Date(raw.created),
      modified: raw.modified === null ? null : new Date(raw.modified),
    };
  };
}
