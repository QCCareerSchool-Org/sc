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
  const { courseService, newMaterialService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: course => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: course });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });
  }, [ administratorId, courseId, dispatch, router, courseService, newMaterialService ]);
};
