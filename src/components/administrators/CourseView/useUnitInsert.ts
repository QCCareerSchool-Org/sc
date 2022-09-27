import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { UnitInsertPayload } from '@/services/administrators/unitService';
import { HttpServiceError } from '@/services/httpService';

export type UnitInsertEvent = {
  processingState: State['unitForm']['processingState'];
  administratorId: number;
  payload: UnitInsertPayload;
};

export const useUnitInsert = (dispatch: Dispatch<Action>): Subject<UnitInsertEvent> => {
  const { unitService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const insert$ = useRef(new Subject<UnitInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    insert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UNIT_STARTED' })),
      exhaustMap(({ administratorId, payload }) => unitService.addUnit(administratorId, payload).pipe(
        tap({
          next: insertedMaterial => dispatch({ type: 'ADD_UNIT_SUCCEEDED', payload: insertedMaterial }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, unitService, navigateToLogin ]);

  return insert$.current;
};
