export type SchoolName = 'QC Makeup Academy' | 'QC Design School' | 'QC Event School' | 'QC Pet Studies' | 'QC Wellness Studies' | 'Winghill Writing School';

export type SchoolSlug = 'makeup' | 'design' | 'event' | 'pet' | 'wellness' | 'writing';

export type School = {
  schoolId: number;
  name: SchoolName;
  slug: SchoolSlug;
  order: number;
  entityVersion: number;
};
