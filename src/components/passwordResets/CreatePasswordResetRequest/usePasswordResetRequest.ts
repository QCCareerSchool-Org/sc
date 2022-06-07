import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, tap } from 'rxjs';

import type { Action, State } from './state';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type PasswordResetRequestEvent = {
  processingState: State['form']['processingState'];
  username: string;
};

export const usePasswordResetRequest = (dispatch: Dispatch<Action>): Subject<PasswordResetRequestEvent> => {
  const { passwordResetRequestService } = useServices();
  const router = useRouter();

  const passwordResetRequest$ = useRef(new Subject<PasswordResetRequestEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    passwordResetRequest$.current.pipe(
      tap(() => dispatch({ type: 'REQUEST_STARTED' })),
      filter(({ processingState }) => processingState === 'idle' || processingState === 'error'),
      switchMap(({ username }) => {
        return passwordResetRequestService.create(username).pipe(
          tap({
            next: result => dispatch({ type: 'REQUEST_SUCCEEDED', payload: result }),
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
              dispatch({ type: 'REQUEST_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, passwordResetRequestService ]);

  return passwordResetRequest$.current;
};
