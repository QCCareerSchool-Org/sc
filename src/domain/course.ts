export interface Course {
  courseId: number;
  schoolId: number;
  code: string;
  version: number;
  name: string;
  subheading: string | null;
  courseGuide: boolean;
  quizzesEnabled: boolean;
  noTutor: boolean;
  submissionType: number;
  order: number;
  enabled: boolean;
  submissionsEnabled: boolean;
}

export const ppaCourseCodes = [ 'PG', 'DM', 'NT', 'TR', 'YK', 'PU', 'TB', 'GR', 'GD', 'PA', 'EG', 'DE' ];
