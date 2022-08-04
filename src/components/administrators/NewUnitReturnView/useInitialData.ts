import { useEffect } from 'react';
import type { Dispatch } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, unitReturnId: string): void => {
  const { newUnitReturnService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitReturnService.getUnitReturn(administratorId, unitReturnId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newUnitReturn => {
        dispatch({ type: 'LOAD_UNIT_RETURN_SUCEEDED', payload: newUnitReturn });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_RETURN_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, unitReturnId, newUnitReturnService, navigateToLogin ]);
};
