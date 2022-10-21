import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, unitId: string): void => {
  const { unitService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitService.getUnit(administratorId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: course => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: course });
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
  }, [ dispatch, administratorId, unitId, unitService, navigateToLogin ]);
};
