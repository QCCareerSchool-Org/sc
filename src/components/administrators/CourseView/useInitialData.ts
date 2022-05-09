import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, courseId: number, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { courseService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, courseId).pipe(
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
  }, [ administratorId, courseId, dispatch, router, courseService ]);
};
