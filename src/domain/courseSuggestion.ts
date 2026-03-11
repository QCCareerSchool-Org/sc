import type { JSX } from 'react';

export interface CourseSuggestion {
  code: string;
  prefix?: string;
  name: string;
  certification: string;
  shortDescription: string;
  description: string | string[] | JSX.Element;
}

export interface CourseSuggestionGroup {
  id: string;
  description: string;
  courses: CourseSuggestion[];
}
