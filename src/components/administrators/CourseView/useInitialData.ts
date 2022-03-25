import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { courseService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (administratorId: number, schoolId: number, courseId: number, dispatch: Dispatch<Action>): void => {
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, schoolId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'LOAD_COURSE_SUCCEEDED', payload: schools });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_COURSE_FAILED', payload: errorCode });
      },
    });
  }, [ administratorId, schoolId, courseId, dispatch, router ]);
};
