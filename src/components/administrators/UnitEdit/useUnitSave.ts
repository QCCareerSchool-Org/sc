import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { UnitSavePayload } from '@/services/administrators/unitService';
import { HttpServiceError } from '@/services/httpService';

export type UnitSaveEvent = {
  administratorId: number;
  unitId: string;
  payload: UnitSavePayload;
  processingState: State['form']['processingState'];
};

export const useUnitSave = (dispatch: Dispatch<Action>): Subject<UnitSaveEvent> => {
  const { unitService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const save$ = useRef(new Subject<UnitSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'SAVE_UNIT_STARTED' })),
      exhaustMap(({ administratorId, unitId, payload }) => unitService.saveUnit(administratorId, unitId, payload).pipe(
        tap({
          next: insertedMaterial => dispatch({ type: 'SAVE_UNIT_SUCEEDED', payload: insertedMaterial }),
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
            dispatch({ type: 'SAVE_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, unitService, navigateToLogin ]);

  return save$.current;
};
