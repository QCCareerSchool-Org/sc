import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { Course } from '@/domain/course';
import type { Material, MaterialType, RawMaterial } from '@/domain/material';
import type { RawUnit, Unit } from '@/domain/unit';
import type { IHttpService, ProgressResponse } from '@/services/httpService';
import { endpoint } from 'src/basePath';

export type MaterialInsertPayload = {
  unitId: string;
  type: MaterialType;
  title: string;
  description: string;
  order: number;
  externalData: string | null;
  lessonMeta: {
    minutes: number;
    chapters: number;
    videos: number;
    knowledgeChecks: number;
  } | null;
};

export type MaterialEditPayload = {
  title: string;
  description: string;
  order: number;
  lessonMeta: {
    minutes: number;
    chapters: number;
    videos: number;
    knowledgeChecks: number;
  } | null;
};

type RawMaterialWithUnitWithCourse = RawMaterial & {
  unit: RawUnit & {
    course: Course;
  };
};

export type MaterialWithUnitWithCourse = Material & {
  unit: Unit & {
    course: Course;
  };
};

export interface IMaterialService {
  getMaterial: (administratorId: number, materialId: string) => Observable<MaterialWithUnitWithCourse>;
  addMaterial: (administratorId: number, data: MaterialInsertPayload, content: File | null, image: File | null) => Observable<ProgressResponse<Material>>;
  saveMaterial: (administratorId: number, materialId: string, data: MaterialEditPayload) => Observable<Material>;
  deleteMaterial: (administratorId: number, materialId: string) => Observable<void>;
  replaceMaterialContent: (administratorId: number, materialId: string, content: File) => Observable<Material>;
  replaceMaterialImage: (administratorId: number, materialId: string, image: File) => Observable<Material>;
  deleteMaterialImage: (administratorId: number, materialId: string) => Observable<Material>;
}

export class MaterialService implements IMaterialService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getMaterial(administratorId: number, materialId: string): Observable<MaterialWithUnitWithCourse> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    return this.http.get<RawMaterialWithUnitWithCourse>(url).pipe(
      map(this.mapMaterialWithUnitWithCourse),
    );
  }

  public addMaterial(administratorId: number, data: MaterialInsertPayload, content: File | null, image: File | null): Observable<ProgressResponse<Material>> {
    const url = this.getUrl(administratorId);
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('unitId', data.unitId);
    body.append('type', data.type);
    body.append('title', data.title);
    body.append('description', data.description);
    body.append('order', data.order.toString());
    if (data.lessonMeta) {
      body.append('lessonMeta[minutes]', data.lessonMeta.minutes.toString());
      body.append('lessonMeta[chapters]', data.lessonMeta.chapters.toString());
      body.append('lessonMeta[videos]', data.lessonMeta.videos.toString());
      body.append('lessonMeta[knowledgeChecks]', data.lessonMeta.knowledgeChecks.toString());
    }
    if (data.externalData) {
      body.append('externalData', data.externalData);
    }
    if (content) {
      body.append('content', content);
    }
    if (image) {
      body.append('image', image);
    }
    return this.http.postFile<RawMaterial>(url, body, { headers }).pipe(
      map(response => {
        if (response.type === 'progress') {
          return response;
        }
        return { type: 'data', value: this.mapMaterial(response.value) };
      }),
    );
  }

  public saveMaterial(administratorId: number, materialId: string, data: MaterialEditPayload): Observable<Material> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    const body = {
      title: data.title,
      description: data.description,
      order: data.order,
      lessonMeta: data.lessonMeta ? {
        minutes: data.lessonMeta.minutes,
        chapters: data.lessonMeta.chapters,
        videos: data.lessonMeta.videos,
        knowledgeChecks: data.lessonMeta.knowledgeChecks,
      } : null,
    };
    return this.http.put<RawMaterial>(url, body).pipe(
      map(this.mapMaterial),
    );
  }

  public deleteMaterial(administratorId: number, materialId: string): Observable<void> {
    const url = `${this.getUrl(administratorId)}/${materialId}`;
    return this.http.delete<void>(url);
  }

  public replaceMaterialContent(administratorId: number, materialId: string, content: File): Observable<Material> {
    const url = `${this.getUrl(administratorId)}/${materialId}/content`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('content', content);
    return this.http.put<RawMaterial>(url, body, { headers }).pipe(
      map(this.mapMaterial),
    );
  }

  public replaceMaterialImage(administratorId: number, materialId: string, image: File): Observable<Material> {
    const url = `${this.getUrl(administratorId)}/${materialId}/image`;
    const headers = { 'Content-Type': 'multipart/form-data' };
    const body = new FormData();
    body.append('image', image);
    return this.http.put<RawMaterial>(url, body, { headers }).pipe(
      map(this.mapMaterial),
    );
  }

  public deleteMaterialImage(administratorId: number, materialId: string): Observable<Material> {
    const url = `${this.getUrl(administratorId)}/${materialId}/image`;
    return this.http.delete<RawMaterial>(url).pipe(
      map(this.mapMaterial),
    );
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/materials`;
  }

  private readonly mapMaterial = (raw: RawMaterial): Material => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });

  private readonly mapMaterialWithUnitWithCourse = (raw: RawMaterialWithUnitWithCourse): MaterialWithUnitWithCourse => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    unit: {
      ...raw.unit,
      created: new Date(raw.unit.created),
      modified: raw.unit.modified === null ? null : new Date(raw.unit.modified),
    },
  });
}
