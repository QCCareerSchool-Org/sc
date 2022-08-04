import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, id: number, code: string): void => {
  const { passwordResetRequestService } = useServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    dispatch({ type: 'LOAD_DATA_STARTED' });
    passwordResetRequestService.get(id, code).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: passwordResetRequest => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: passwordResetRequest }),
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
  }, [ dispatch, id, code, passwordResetRequestService, navigateToLogin ]);
};
