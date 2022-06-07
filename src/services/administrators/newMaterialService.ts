import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewMaterial, RawNewMaterial } from '@/domain/newMaterial';

export type NewMaterialPayload = {
  courseId: number;
  type: 'lesson' | 'video' | 'download' | 'assignment';
  title: string;
  description: string;
  unitLetter: string;
  order: number;
  externalData: string | null;
};

export interface INewMaterialService {
  getAllMaterials: (administratorId: number, courseId: number) => Observable<NewMaterial[]>;
  getMaterial: (administratorId: number, materialId: string) => Observable<NewMaterial>;
  addMaterial: (administratorId: number, data: NewMaterialPayload, file?: File) => Observable<NewMaterial>;
  saveMaterial: (administratorId: number, materialId: string, data: NewMaterialPayload) => Observable<NewMaterial>;
  replaceMaterialFile: (administratorId: number, materialId: string, file: File) => Observable<NewMaterial>;
  deleteMaterial: (administratorId: number, materialId: string) => Observable<void>;
}

export class NewMaterialService implements INewMaterialService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getAllMaterials(administratorId: number, courseId: number): Observable<NewMaterial[]> {
    const url = this.getUrl(administratorId);
    const params = { courseId };
    return this.http.get<RawNewMaterial[]>(url, { params }).pipe(
      map(materials => materials.map(this.mapNewMaterial)),
    );
  }

  public getMaterial(administratorId: number, materialId: string): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    return this.http.get<RawNewMaterial>(url).pipe(
      map(this.mapNewMaterial),
    );
  }

  public addMaterial(administratorId: number, data: NewMaterialPayload, file?: File): Observable<NewMaterial> {
    const url = this.getUrl(administratorId);
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('courseId', data.courseId.toString());
    body.append('type', data.type);
    body.append('title', data.title);
    body.append('description', data.description);
    body.append('unitLetter', data.unitLetter);
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

  public saveMaterial(administratorId: number, materialId: string, data: NewMaterialPayload): Observable<NewMaterial> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    const body = {
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      unitLetter: data.unitLetter,
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
