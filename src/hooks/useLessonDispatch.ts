import type { Dispatch } from 'react';
import { useContext } from 'react';

import { LessonDispatchContext } from '@/providers/LessonProvider';
import type { LessonAction } from '@/state/lesson';

export const useLessonDispatch = (): Dispatch<LessonAction> => {
  const dispatch = useContext(LessonDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useLessonDispatch must be used within an LessonProvider');
  }
  return dispatch;
};
