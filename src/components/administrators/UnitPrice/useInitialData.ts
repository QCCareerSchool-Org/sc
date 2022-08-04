import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number): void => {
  const { courseService, countryService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

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
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, courseService, countryService, navigateToLogin ]);
};
