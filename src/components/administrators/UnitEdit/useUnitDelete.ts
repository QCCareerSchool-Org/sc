import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type UnitDeleteEvent = {
  administratorId: number;
  unitId: string;
  processingState: State['form']['processingState'];
};

export const useUnitDelete = (dispatch: Dispatch<Action>): Subject<UnitDeleteEvent> => {
  const { unitService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

  const delete$ = useRef(new Subject<UnitDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    delete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'DELETE_UNIT_STARTED' })),
      exhaustMap(({ administratorId, unitId }) => unitService.deleteUnit(administratorId, unitId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_UNIT_SUCEEDED' });
            router.back();
          },
          error: err => {
            let message = 'Delete failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'DELETE_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, unitService, navigateToLogin, router ]);

  return delete$.current;
};
