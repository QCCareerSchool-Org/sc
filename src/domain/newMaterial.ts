export type NewMaterialType = 'lesson' | 'video' | 'download' | 'assignment';

export type NewMaterial = {
  /** uuid */
  materialId: string;
  courseId: number;
  type: NewMaterialType;
  title: string;
  description: string;
  unitLetter: string;
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
  courseId: number;
  type: NewMaterialType;
  title: string;
  description: string;
  unitLetter: string;
  order: number;
  filename: string | null;
  mimeTypeId: string | null;
  externalData: string | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
