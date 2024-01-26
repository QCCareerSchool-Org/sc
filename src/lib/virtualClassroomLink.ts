import type { SchoolSlug } from '@/domain/school';

export function getVirtualClassroomLink(schoolSlug: 'design'): string;
export function getVirtualClassroomLink(schoolSlug: 'event'): string;
export function getVirtualClassroomLink(schoolSlug: 'makeup'): string;
export function getVirtualClassroomLink(schoolSlug: 'pet'): string;
export function getVirtualClassroomLink(schoolSlug: SchoolSlug): string | null;
export function getVirtualClassroomLink(schoolSlug: SchoolSlug): string | null {
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
