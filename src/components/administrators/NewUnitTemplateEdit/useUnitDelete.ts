import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitTemplateDeleteEvent = {
  administratorId: number;
  unitId: string;
  processingState: State['form']['processingState'];
};

export const useUnitDelete = (dispatch: Dispatch<Action>): Subject<NewUnitTemplateDeleteEvent> => {
  const { newUnitTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

  const unitDelete$ = useRef(new Subject<NewUnitTemplateDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, unitId }) => newUnitTemplateService.deleteUnit(administratorId, unitId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_UNIT_TEMPLATE_SUCCEEDED' });
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
            dispatch({ type: 'DELETE_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitTemplateService, navigateToLogin, router ]);

  return unitDelete$.current;
};
