import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewMaterialUnitInsertPayload } from '@/services/administrators/newMaterialUnitService';
import { HttpServiceError } from '@/services/httpService';

export type NewMaterialUnitInsertEvent = {
  processingState: State['newMaterialUnitForm']['processingState'];
  administratorId: number;
  payload: NewMaterialUnitInsertPayload;
};

export const useMaterialUnitInsert = (dispatch: Dispatch<Action>): Subject<NewMaterialUnitInsertEvent> => {
  const { newMaterialUnitService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const materialInsert$ = useRef(new Subject<NewMaterialUnitInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_MATERIAL_UNIT_STARTED' })),
      exhaustMap(({ administratorId, payload }) => newMaterialUnitService.addMaterialUnit(administratorId, payload).pipe(
        tap({
          next: insertedMaterial => dispatch({ type: 'ADD_MATERIAL_UNIT_SUCCEEDED', payload: insertedMaterial }),
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
            dispatch({ type: 'ADD_MATERIAL_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newMaterialUnitService, navigateToLogin ]);

  return materialInsert$.current;
};
