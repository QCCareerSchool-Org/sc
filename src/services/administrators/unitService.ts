import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { endpoint } from '../../basePath';
import type { IHttpService } from '../httpService';
import type { Material, RawMaterial } from '@/domain/material';
import type { RawUnit, Unit } from '@/domain/unit';

export type UnitWithMaterials = Unit & {
  materials: Material[];
};

type RawUnitWithMaterials = RawUnit & {
  materials: RawMaterial[];
};

export type UnitInsertPayload = {
  courseId: number;
  unitLetter: string;
  title: string | null;
  order: number;
};

export type UnitSavePayload = {
  unitLetter: string;
  title: string | null;
  order: number;
};

export interface IUnitService {
  getUnit: (administratorId: number, unitId: string) => Observable<UnitWithMaterials>;
  addUnit: (administratorId: number, data: UnitInsertPayload) => Observable<Unit>;
  saveUnit: (administratorId: number, unitId: string, data: UnitSavePayload) => Observable<Unit>;
  deleteUnit: (administratorId: number, unitId: string) => Observable<void>;
}

export class UnitService implements IUnitService {

  public constructor(private readonly http: IHttpService) { /* empty */ }

  public getUnit(administratorId: number, unitId: string): Observable<UnitWithMaterials> {
    const url = `${this.getUrl(administratorId)}/${unitId}`;
    return this.http.get<RawUnitWithMaterials>(url).pipe(
      map(this.mapUnitWithMaterials),
    );
  }

  public addUnit(administratorId: number, data: UnitInsertPayload): Observable<Unit> {
    const url = this.getUrl(administratorId);
    const body = {
      courseId: data.courseId,
      unitLetter: data.unitLetter,
      title: data.title,
      order: data.order,
    };
    return this.http.post<RawUnit>(url, body).pipe(
      map(this.mapUnit),
    );
  }

  public saveUnit(administratorId: number, unitId: string, data: UnitSavePayload): Observable<Unit> {
    const url = `${this.getUrl(administratorId)}/${unitId}`;
    const body = {
      unitLetter: data.unitLetter,
      title: data.title,
      order: data.order,
    };
    return this.http.put<RawUnit>(url, body).pipe(
      map(this.mapUnit),
    );
  }

  public deleteUnit(administratorId: number, unitId: string): Observable<void> {
    const url = `${this.getUrl(administratorId)}/${unitId}`;
    return this.http.delete<void>(url);
  }

  private getUrl(administratorId: number): string {
    return `${endpoint}/administrators/${administratorId}/units`;
  }

  private readonly mapUnit = (raw: RawUnit): Unit => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
  });

  private readonly mapUnitWithMaterials = (raw: RawUnitWithMaterials): UnitWithMaterials => ({
    ...raw,
    created: new Date(raw.created),
    modified: raw.modified === null ? null : new Date(raw.modified),
    materials: raw.materials.map(m => ({
      ...m,
      created: new Date(m.created),
      modified: m.modified === null ? null : new Date(m.modified),
    })),
  });
}
