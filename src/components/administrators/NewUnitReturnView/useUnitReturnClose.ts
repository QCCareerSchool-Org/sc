import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitCloseEvent = {
  administratorId: number;
  unitReturnId: string;
  adminComment: string;
  processingState: State['form']['processingState'];
};

export const useUnitReturnClose = (dispatch: Dispatch<Action>): Subject<NewUnitCloseEvent> => {
  const { newUnitReturnService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

  const unitReturnClose$ = useRef(new Subject<NewUnitCloseEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitReturnClose$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'SAVE_ADMIN_COMMENT_STARTED' })),
      exhaustMap(({ administratorId, unitReturnId, adminComment }) => {
        return newUnitReturnService.closeUnitReturn(administratorId, unitReturnId, adminComment).pipe(
          tap({
            next: newUnitReturn => {
              dispatch({ type: 'SAVE_ADMIN_COMMENT_SUCEEDED', payload: newUnitReturn });
              router.back();
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SAVE_ADMIN_COMMENT_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitReturnService, navigateToLogin, router ]);

  return unitReturnClose$.current;
};
