import type { SchoolSlug } from '@/domain/school.js';
import { isSchoolSlug } from '@/domain/school.js';

export interface RequestRoute {
  question: QuestionClassification;
  school: SchoolClassification;
}

export const isRequestRoute = (value: unknown): value is RequestRoute => {
  return value !== null && typeof value === 'object'
    && 'question' in value && isQuestionClassification(value.question)
    && 'school' in value && isSchoolClassification(value.school);
};

export const questionClassifications = [ 'logistics', 'learning', 'assignment-help' ] as const;

export type QuestionClassification = typeof questionClassifications[number];

const set = new Set(questionClassifications);

export const isQuestionClassification = (value: unknown): value is QuestionClassification => {
  return typeof value === 'string' && set.has(value as QuestionClassification);
};

export type SchoolClassification = SchoolSlug | 'unknown';

export const isSchoolClassification = (value: unknown): value is SchoolClassification => {
  return isSchoolSlug(value) || value === 'unknown';
};
