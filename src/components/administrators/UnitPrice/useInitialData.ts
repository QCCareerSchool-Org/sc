import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { courseService, countryService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    dispatch({ type: 'LOAD_DATA_STARTED' });
    forkJoin([
      courseService.getAllCourses(administratorId),
      countryService.getAllCountries(administratorId),
    ]).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: ([ courses, countries ]) => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: { courses, countries } });
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

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, dispatch, router, courseService, countryService ]);
};
