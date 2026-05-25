import type { PromptClassification } from './promptClassification.mjs';
import type { SchoolSlug } from '@/domain/school';

interface VectorStores {
  general: string;
  assignments: Partial<Record<SchoolSlug, string>>;
  lessons: Partial<Record<SchoolSlug, string>>;
}

const vectorStores: VectorStores = {
  general: 'vs_6a0f10bd9c60819181d27ab29297f270',
  assignments: {},
  lessons: {},
} as const;

export const getQuestionVectorStoreIds = (classification: PromptClassification): string[] => {
  const vectorStoreIds: string[] = [ vectorStores.general ];

  if (classification.school === 'unknown') {
    if (classification.question === 'learning') {
      vectorStoreIds.push(...Object.values(vectorStores.lessons));
    }

    if (classification.question === 'assignment-help') {
      vectorStoreIds.push(...Object.values(vectorStores.assignments), ...Object.values(vectorStores.lessons));
    }
  } else {
    if (classification.question === 'learning') {
      const lessonsStore = vectorStores.lessons[classification.school];
      if (lessonsStore) {
        vectorStoreIds.push(lessonsStore);
      }
    }

    if (classification.question === 'assignment-help') {
      const assignmentsStore = vectorStores.assignments[classification.school];
      if (assignmentsStore) {
        vectorStoreIds.push(assignmentsStore);
      }
      const lessonsStore = vectorStores.lessons[classification.school];
      if (lessonsStore) {
        vectorStoreIds.push(lessonsStore);
      }
    }
  }

  return vectorStoreIds;
};

export const getAnswerVectorStoreId = (classification: PromptClassification): string | undefined => {
  if (classification.question === 'logistics') {
    return vectorStores.general;
  }

  if (classification.school === 'unknown') {
    return;
  }

  const lessonsStore = vectorStores.lessons[classification.school];
  if (lessonsStore) {
    return lessonsStore;
  }
};
