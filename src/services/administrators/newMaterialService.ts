import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewMaterial, RawNewMaterial } from '@/domain/newMaterial';

export type NewMaterialInsertPayload = {
  type: 'lesson' | 'video' | 'download' | 'assignment';
  title: string;
  description: string;
  order: number;
  externalData: string | null;
};

export type NewMaterialEditPayload = {
  title: string;
  description: string;
  order: number;
};

export interface INewMaterialService {
  getMaterial: (administratorId: number, materialUnitId: string, materialId: string) => Observable<NewMaterial>;
  addMaterial: (administratorId: number, materialUnitId: string, data: NewMaterialInsertPayload, file?: File) => Observable<NewMaterial>;
  saveMaterial: (administratorId: number, materialUnitId: string, materialId: string, data: NewMaterialEditPayload) => Observable<NewMaterial>;
  replaceMaterialFile: (administratorId: number, materialUnitId: string, materialId: string, file: File) => Observable<NewMaterial>;
  deleteMaterial: (administratorId: number, materialUnitId: string, materialId: string) => Observable<void>;
}

export class NewMaterialService implements INewMaterialService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getMaterial(administratorId: number, materialUnitId: string, materialId: string): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId, materialUnitId)}/${materialId}`;
    return this.http.get<RawNewMaterial>(url).pipe(
      map(this.mapNewMaterial),
    );
  }

  public addMaterial(administratorId: number, materialUnitId: string, data: NewMaterialInsertPayload, file?: File): Observable<NewMaterial> {
    const url = this.getUrl(administratorId, materialUnitId);
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('type', data.type);
    body.append('title', data.title);
    body.append('description', data.description);
    body.append('order', data.order.toString());
    if (file) {
      body.append('file', file);
    }
    if (data.externalData) {
      body.append('externalData', data.externalData);
    }
    return this.http.post<RawNewMaterial>(url, body, { headers }).pipe(
      map(this.mapNewMaterial),
    );
  }

  public saveMaterial(administratorId: number, materialUnitId: string, materialId: string, data: NewMaterialEditPayload): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId, materialUnitId)}/${materialId}`;
    const body = {
      title: data.title,
      description: data.description,
      order: data.order,
    };
    return this.http.put<RawNewMaterial>(url, body).pipe(
      map(this.mapNewMaterial),
    );
  }

  public replaceMaterialFile(administratorId: number, materialUnitId: string, materialId: string, file: File): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId, materialUnitId)}/${materialId}/file`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('file', file);
    return this.http.post<RawNewMaterial>(url, body, { headers }).pipe(
      map(this.mapNewMaterial),
    );
  }

  public deleteMaterial(administratorId: number, materialUnitId: string, materialId: string): Observable<void> {
    const url = `${this.getUrl(administratorId, materialUnitId)}/${materialId}`;
    return this.http.delete<void>(url);
  }

  private getUrl(administratorId: number, materialUnitId: string): string {
    return `${endpoint}/administrators/${administratorId}/newMaterialUnits/${materialUnitId}/newMaterials`;
  }

  private readonly mapNewMaterial = (raw: RawNewMaterial): NewMaterial => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });
}
