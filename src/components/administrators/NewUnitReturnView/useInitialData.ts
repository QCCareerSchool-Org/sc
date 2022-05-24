import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { Dispatch } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (administratorId: number, unitReturnId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newUnitReturnService } = useAdminServices();

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
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_RETURN_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, unitReturnId, dispatch, router, newUnitReturnService ]);
};
