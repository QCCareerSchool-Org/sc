import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (id: number, code: string, dispatch: Dispatch<Action>): void => {
  const { passwordResetRequestService } = useServices();
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    console.log('here');
    dispatch({ type: 'LOAD_DATA_STARTED' });
    passwordResetRequestService.get(id, code).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: passwordResetRequest => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: passwordResetRequest }),
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
  }, [ id, code, dispatch, router, passwordResetRequestService ]);
};
