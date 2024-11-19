import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';

import { useLessonDispatch } from '@/hooks/useLessonDispatch';
import { useLessonState } from '@/hooks/useLessonState';

export const LessonCloser: FC = () => {
  const lessonState = useLessonState();
  const lessonDispatch = useLessonDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (): void => {
      if (lessonState.currentLesson) {
        lessonState.currentLesson.window.close();
        lessonDispatch({ type: 'CLEAR_LESSON' });
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [ router.events, lessonState, lessonDispatch ]);

  return null;
};
