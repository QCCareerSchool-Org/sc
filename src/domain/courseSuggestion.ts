export type CourseSuggestion = {
  code: string;
  prefix?: string;
  name: string;
  certification: string;
  shortDescription: string;
  description: string | string[] | JSX.Element;
};

export type CourseSuggestionGroup = {
  id: string;
  description: string;
  courses: CourseSuggestion[];
};
