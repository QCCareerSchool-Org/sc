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

export const getVectorStoreIds = (route: PromptClassification): string[] => {
  const vectorStoreIds: string[] = [ vectorStores.general ];

  if (route.school === 'unknown') {
    if (route.question === 'learning') {
      vectorStoreIds.push(...Object.values(vectorStores.lessons));
    }

    if (route.question === 'assignment-help') {
      vectorStoreIds.push(...Object.values(vectorStores.assignments), ...Object.values(vectorStores.lessons));
    }
  } else {
    if (route.question === 'learning') {
      const lessonsStore = vectorStores.lessons[route.school];
      if (lessonsStore) {
        vectorStoreIds.push(lessonsStore);
      }
    }

    if (route.question === 'assignment-help') {
      const assignmentsStore = vectorStores.assignments[route.school];
      if (assignmentsStore) {
        vectorStoreIds.push(assignmentsStore);
      }
      const lessonsStore = vectorStores.lessons[route.school];
      if (lessonsStore) {
        vectorStoreIds.push(lessonsStore);
      }
    }
  }

  return vectorStoreIds;
};
