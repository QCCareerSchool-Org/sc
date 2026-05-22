export const schoolSlugs = [ 'design', 'makeup', 'event', 'pet', 'wellness', 'writing', 'paw-parent' ] as const;

const schoolSlugSet = new Set(schoolSlugs);

export type SchoolSlug = typeof schoolSlugs[number];

export const isSchoolSlug = (u: unknown): u is SchoolSlug => {
  return typeof u === 'string' && schoolSlugSet.has(u as SchoolSlug);
};

export const schoolNames = [ 'QC Makeup Academy', 'QC Design School', 'QC Event School', 'QC Pet Studies', 'QC Wellness Studies', 'Winghill Writing School' ] as const;

export type SchoolName = typeof schoolNames[number];

const schoolNameSet = new Set(schoolNames);

export const isSchoolName = (u: unknown): u is SchoolName => {
  return typeof u === 'string' && schoolNameSet.has(u as SchoolName);
};

export interface School {
  schoolId: number;
  name: SchoolName;
  slug: SchoolSlug;
  order: number;
  entityVersion: number;
}
