import type { SchoolSlug } from '@/domain/school';

export function getVirtualCommunityLink(schoolSlug: 'design'): string;
export function getVirtualCommunityLink(schoolSlug: 'event'): string;
export function getVirtualCommunityLink(schoolSlug: 'makeup'): string;
export function getVirtualCommunityLink(schoolSlug: 'pet'): string;
export function getVirtualCommunityLink(schoolSlug: SchoolSlug): string | null;
export function getVirtualCommunityLink(schoolSlug: SchoolSlug): string | null {
  if (schoolSlug === 'design') {
    return 'https://www.facebook.com/groups/QCDesignSchoolVirtualClassroom';
  } else if (schoolSlug === 'event') {
    return 'https://www.facebook.com/groups/qceventschoolvc';
  } else if (schoolSlug === 'makeup') {
    return 'https://www.facebook.com/groups/qcmakeupacademyvc';
  } else if (schoolSlug === 'pet') {
    return 'https://www.facebook.com/groups/qcpetstudiesvirtualclassroom';
  }
  return null;
}
