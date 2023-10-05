export type SurveyCompletion = {
  /** uuid */
  surveyCompletionId: string;
  /** uuid */
  surveyId: string;
  enrollmentId: number;
  created: Date;
  modified: Date | null;
};

export type RawSurveyCompletion = {
  /** uuid */
  surveyCompletionId: string;
  /** uuid */
  surveyId: string;
  enrollmentId: number;
  /** string date */
  created: string;
  /** string date */
  modified: string | null;
};
