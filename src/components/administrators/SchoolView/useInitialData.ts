import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, schoolId: number, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { schoolService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    schoolService.getSchool(administratorId, schoolId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: school => {
        dispatch({ type: 'LOAD_SCHOOL_SUCCEEDED', payload: school });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_SCHOOL_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId, dispatch, router, schoolService ]);
};
