export type Course = {
  courseId: number;
  schoolId: number;
  code: string;
  version: number;
  name: string;
  courseGuide: boolean;
  quizzesEnabled: boolean;
  noTutor: boolean;
  submissionType: number;
  order: number;
  enabled: boolean;
  submissionsEnabled: boolean;
};

export const ppaCourseCodes = [ 'PG', 'DM', 'NT', 'TR', 'YK', 'PU', 'TB', 'GR', 'GD', 'PA', 'EG', 'DE' ];
