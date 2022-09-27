export type NewSubmissionTemplate = {
  /** uuid */
  submissionTemplateId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  optional: boolean;
  order: number;
  enabled: boolean;
  created: Date;
  modified: Date | null;
};

export type RawNewSubmissionTemplate = {
  /** uuid */
  submissionTemplateId: string;
  courseId: number;
  unitLetter: string;
  title: string | null;
  description: string | null;
  markingCriteria: string | null;
  optional: boolean;
  order: number;
  enabled: boolean;
  /** date string */
  created: string;
  /** date string */
  modified: string | null;
};
