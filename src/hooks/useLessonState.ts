import { useContext } from 'react';

import { LessonStateContext } from '@/providers/LessonProvider';
import type { LessonState } from '@/state/lesson';

export const useLessonState = (): LessonState => {
  const state = useContext(LessonStateContext);
  if (typeof state === 'undefined') {
    throw Error('useLessonState must be used within an LessonProvider');
  }
  return state;
};
