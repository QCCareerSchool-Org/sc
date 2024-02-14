import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAuditorServices } from '@/hooks/useAuditorServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type PasswordChangeEvent = {
  auditorId: number;
  newPassword: string;
  newPasswordRepeat: string;
  password: string;
  processingState: State['form']['processingState'];
};

export const useSubmit = (dispatch: Dispatch<Action>): Subject<PasswordChangeEvent> => {
  const navigateToLogin = useNavigateToLogin();
  const { auditorService } = useAuditorServices();

  const filter$ = useRef(new Subject<PasswordChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    filter$.current.pipe(
      tap(() => dispatch({ type: 'UPDATE_STARTED' })),
      switchMap(event => auditorService.updatePassword(event.auditorId, event.newPassword, event.newPasswordRepeat, event.password).pipe(
        tap({
          next: () => dispatch({ type: 'UPDATE_SUCCEEDED' }),
          error: err => {
            let message = 'Update failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'UPDATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, auditorService, navigateToLogin ]);

  return filter$.current;
};
