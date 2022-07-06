import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService, ProgressResponse } from '../httpService';
import type { NewMaterial, RawNewMaterial } from '@/domain/newMaterial';

export type NewMaterialInsertPayload = {
  materialUnitId: string;
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
  getMaterial: (administratorId: number, materialId: string) => Observable<NewMaterial>;
  addMaterialFile: (administratorId: number, data: NewMaterialInsertPayload, content: File | null, image: File | null) => Observable<ProgressResponse<NewMaterial>>;
  saveMaterial: (administratorId: number, materialId: string, data: NewMaterialEditPayload) => Observable<NewMaterial>;
  replaceMaterialFile: (administratorId: number, materialId: string, file: File) => Observable<NewMaterial>;
  deleteMaterial: (administratorId: number, materialId: string) => Observable<void>;
}

export class NewMaterialService implements INewMaterialService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getMaterial(administratorId: number, materialId: string): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    return this.http.get<RawNewMaterial>(url).pipe(
      map(this.mapNewMaterial),
    );
  }

  public addMaterialFile(administratorId: number, data: NewMaterialInsertPayload, content: File | null, image: File | null): Observable<ProgressResponse<NewMaterial>> {
    console.log(data);
    const url = this.getUrl(administratorId);
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('materialUnitId', data.materialUnitId);
    body.append('type', data.type);
    body.append('title', data.title);
    body.append('description', data.description);
    body.append('order', data.order.toString());
    if (data.externalData) {
      body.append('externalData', data.externalData);
    }
    if (content) {
      body.append('content', content);
    }
    if (image) {
      body.append('image', image);
    }
    return this.http.postFile<RawNewMaterial>(url, body, { headers }).pipe(
      map(response => {
        if (response.type === 'progress') {
          return response;
        }
        return { type: 'data', value: this.mapNewMaterial(response.value) };
      }),
    );
  }

  public saveMaterial(administratorId: number, materialId: string, data: NewMaterialEditPayload): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    const body = {
      title: data.title,
      description: data.description,
      order: data.order,
    };
    return this.http.put<RawNewMaterial>(url, body).pipe(
      map(this.mapNewMaterial),
    );
  }

  public replaceMaterialFile(administratorId: number, materialId: string, file: File): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId)}/${materialId}/file`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('file', file);
    return this.http.post<RawNewMaterial>(url, body, { headers }).pipe(
      map(this.mapNewMaterial),
    );
  }

  public deleteMaterial(administratorId: number, materialId: string): Observable<void> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    return this.http.delete<void>(url);
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newMaterials`;
  }

  private readonly mapNewMaterial = (raw: RawNewMaterial): NewMaterial => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });
}
