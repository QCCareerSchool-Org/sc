import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { NewMaterial, RawNewMaterial } from '@/domain/newMaterial';
import type { NewMaterialUnit, RawNewMaterialUnit } from '@/domain/newMaterialUnit';

export type NewMaterialUnitWithMaterials = NewMaterialUnit & {
  newMaterials: NewMaterial[];
};

type RawNewMaterialUnitWithMaterials = RawNewMaterialUnit & {
  newMaterials: RawNewMaterial[];
};

export type NewMaterialUnitInsertPayload = {
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
};

export type NewMaterialUnitSavePayload = {
  unitLetter: string;
  title: string | null;
  order: number;
};

export interface INewMaterialUnitService {
  getMaterialUnit: (administratorId: number, materialUnitId: string) => Observable<NewMaterialUnitWithMaterials>;
  addMaterialUnit: (administratorId: number, data: NewMaterialUnitInsertPayload) => Observable<NewMaterialUnit>;
  saveMaterialUnit: (administratorId: number, materialUnitId: string, data: NewMaterialUnitSavePayload) => Observable<NewMaterialUnit>;
  deleteMaterialUnit: (administratorId: number, materialUnitId: string) => Observable<void>;
}

export class NewMaterialUnitService implements INewMaterialUnitService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getMaterialUnit(administratorId: number, materialUnitId: string): Observable<NewMaterialUnitWithMaterials> {
    const url = `${this.getUrl(administratorId)}/${materialUnitId}`;
    return this.http.get<RawNewMaterialUnitWithMaterials>(url).pipe(
      map(this.mapNewMaterialUnitWithMaterials),
    );
  }

  public addMaterialUnit(administratorId: number, data: NewMaterialUnitInsertPayload): Observable<NewMaterialUnit> {
    const url = this.getUrl(administratorId);
    const body = {
      courseId: data.courseId,
      unitLetter: data.unitLetter,
      title: data.title,
      order: data.order,
    };
    return this.http.post<RawNewMaterialUnit>(url, body).pipe(
      map(this.mapNewMaterialUnit),
    );
  }

  public saveMaterialUnit(administratorId: number, materialUnitId: string, data: NewMaterialUnitSavePayload): Observable<NewMaterialUnit> {
    const url = `${this.getUrl(administratorId)}/${materialUnitId}`;
    const body = {
      unitLetter: data.unitLetter,
      title: data.title,
      order: data.order,
    };
    return this.http.put<RawNewMaterialUnit>(url, body).pipe(
      map(this.mapNewMaterialUnit),
    );
  }

  public deleteMaterialUnit(administratorId: number, materialUnitId: string): Observable<void> {
    const url = `${this.getUrl(administratorId)}/${materialUnitId}`;
    return this.http.delete<void>(url);
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/newMaterialUnits`;
  }

  private readonly mapNewMaterialUnit = (raw: RawNewMaterialUnit): NewMaterialUnit => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });

  private readonly mapNewMaterialUnitWithMaterials = (raw: RawNewMaterialUnitWithMaterials): NewMaterialUnitWithMaterials => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    newMaterials: raw.newMaterials.map(m => ({
      ...m,
      created: new Date(m.created),
      modified: m.modified === null ? null : new Date(m.modified),
    })),
  });
}
