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
  contentMimeTypeId: string | null;
  imageMimeTypeId: string | null;
  externalData: string | null;
  entryPoint: string | null;
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
  contentMimeTypeId: string | null;
  imageMimeTypeId: string | null;
  externalData: string | null;
  entryPoint: string | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
