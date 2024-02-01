export type MaterialType = 'lesson' | 'video' | 'download' | 'assignment' | 'scorm2004';

export type Material = {
  /** uuid */
  materialId: string;
  /** uuid */
  unitId: string;
  type: MaterialType;
  title: string;
  description: string;
  order: number;
  filename: string | null;
  contentMimeTypeId: string | null;
  imageMimeTypeId: string | null;
  externalData: string | null;
  entryPoint: string | null;
  minutes: number | null;
  chapters: number | null;
  videos: number | null;
  knowledgeChecks: number | null;
  created: Date;
  modified: Date | null;
};

export type RawMaterial = {
  /** uuid */
  materialId: string;
  /** uuid */
  unitId: string;
  type: MaterialType;
  title: string;
  description: string;
  order: number;
  filename: string | null;
  contentMimeTypeId: string | null;
  imageMimeTypeId: string | null;
  externalData: string | null;
  entryPoint: string | null;
  minutes: number | null;
  chapters: number | null;
  videos: number | null;
  knowledgeChecks: number | null;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
