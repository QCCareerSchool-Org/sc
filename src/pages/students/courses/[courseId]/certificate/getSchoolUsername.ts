import type { SchoolName } from '@/domain/school';

export const getSchoolUsername = (schoolName: SchoolName) => {
  switch (schoolName) {
    case 'QC Design School':
      return '@QCDesignSchool';
    case 'QC Event School':
      return '@QCEventSchool';
    case 'QC Makeup Academy':
      return '@QCMakeupAcademy';
    case 'QC Pet Studies':
      return '@QCPetStudies';
    default:
      return '@QCCareerSchool';
  }
};
