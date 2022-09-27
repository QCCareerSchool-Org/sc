export type Course = {
  courseId: number;
  schoolId: number;
  code: string;
  version: string;
  name: string;
  courseGuide: boolean;
  quizzesEnabled: boolean;
  noTutor: boolean;
  submissionType: number;
  order: number;
  enabled: boolean;
  submissionsEnabled: boolean;
};
