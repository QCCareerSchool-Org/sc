import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type CourseEnablePayload = {
  administratorId: number;
  courseId: number;
  enable: boolean;
  processingState: State['enableForm']['processingState'];
};

export const useCourseEnable = (dispatch: Dispatch<Action>): Subject<CourseEnablePayload> => {
  const router = useRouter();
  const { courseService } = useAdminServices();

  const courseEnable$ = useRef(new Subject<CourseEnablePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseEnable$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'ENABLE_COURSE_STARTED' })),
      exhaustMap(({ administratorId, courseId, enable }) => courseService.enableCourse(administratorId, courseId, enable).pipe(
        tap({
          next: course => dispatch({ type: 'ENABLE_COURSE_SUCCEEDED', payload: course }),
          error: err => {
            let message = 'Updating course failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ENABLE_COURSE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, courseService ]);

  return courseEnable$.current;
};
