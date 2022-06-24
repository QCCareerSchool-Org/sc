export type NewMaterialType = 'lesson' | 'video' | 'download' | 'assignment';

export type NewMaterial = {
  /** uuid */
  materialId: string;
  /** uuid */
  materialUnitId: string;
  type: NewMaterialType;
  title: string;
  description: string;
  order: number;
  filename: string | null;
  mimeTypeId: string | null;
  externalData: string | null;
  created: Date;
  modified: Date | null;
};

export type RawNewMaterial = {
  /** uuid */
  materialId: string;
  /** uuid */
  materialUnitId: string;
  type: NewMaterialType;
  title: string;
  description: string;
  order: number;
  filename: string | null;
  mimeTypeId: string | null;
  externalData: string | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
