import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import type { Action, State } from './state';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type PasswordChangeEvent = {
  processingState: State['form']['processingState'];
  passwordResetId: number;
  code: string;
  password: string;
};

export const usePasswordChange = (dispatch: Dispatch<Action>): Subject<PasswordChangeEvent> => {
  const router = useRouter();
  const { passwordResetRequestService } = useServices();

  const passwordChange$ = useRef(new Subject<PasswordChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    passwordChange$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'error'),
      tap(() => dispatch({ type: 'RESET_STARTED' })),
      switchMap(({ passwordResetId, code, password }) => passwordResetRequestService.use(passwordResetId, code, password).pipe(
        tap({
          next: () => dispatch({ type: 'RESET_SUCCEEDED' }),
          error: err => {
            let message = 'Request failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'RESET_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, passwordResetRequestService ]);

  return passwordChange$.current;
};
