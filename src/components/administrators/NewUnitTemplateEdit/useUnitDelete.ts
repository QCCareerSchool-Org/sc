import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type UnitDeletePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  processingState: State['form']['processingState'];
};

export const useUnitDelete = (dispatch: Dispatch<Action>): Subject<UnitDeletePayload> => {
  const router = useRouter();
  const { newUnitTemplateService } = useAdminServices();

  const unitDelete$ = useRef(new Subject<UnitDeletePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId }) => newUnitTemplateService.deleteUnit(administratorId, schoolId, courseId, unitId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'DELETE_UNIT_TEMPLATE_SUCCEEDED' });
            router.back();
          },
          error: err => {
            let message = 'Delete failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
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
  }, [ dispatch, router, newUnitTemplateService ]);

  return unitDelete$.current;
};
