import type { RawAward } from '@/domain/award';
import { isSchoolName } from '@/domain/school';

export const isRawAward = (obj: unknown): obj is RawAward => {
  return typeof obj === 'object' && obj !== null &&
    'submissionId' in obj && (typeof obj.submissionId === 'string' || typeof obj.submissionId === 'number') &&
    'courseName' in obj && typeof obj.courseName === 'string' &&
    'schoolName' in obj && typeof obj.schoolName === 'string' && isSchoolName(obj.schoolName) &&
    'unitLetter' in obj && typeof obj.unitLetter === 'string' &&
    'grade' in obj && typeof obj.grade === 'string' &&
    'name' in obj && typeof obj.name === 'string' &&
    'created' in obj && (typeof obj.created === 'string' || obj.created === null);
};
