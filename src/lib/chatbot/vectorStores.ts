import type { SchoolSlug } from '@/domain/school';

type VectorStores = Record<SchoolSlug, string>;

export const vectorStoreIds: VectorStores = {
  'design': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'event': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'makeup': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'pet': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'wellness': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'writing': 'vs_6a0f10bd9c60819181d27ab29297f270',
  'paw-parent': 'vs_6a0f10bd9c60819181d27ab29297f270',
} as const;
