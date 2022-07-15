import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewMaterialUnitSavePayload } from '@/services/administrators/newMaterialUnitService';
import { HttpServiceError } from '@/services/httpService';

export type NewMaterialUnitSaveEvent = {
  processingState: State['form']['processingState'];
  administratorId: number;
  materialUnitId: string;
  payload: NewMaterialUnitSavePayload;
};

export const useMaterialUnitSave = (dispatch: Dispatch<Action>): Subject<NewMaterialUnitSaveEvent> => {
  const router = useRouter();
  const { newMaterialUnitService } = useAdminServices();

  const materialUnitSave$ = useRef(new Subject<NewMaterialUnitSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialUnitSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'SAVE_MATERIAL_UNIT_STARTED' })),
      exhaustMap(({ administratorId, materialUnitId, payload }) => newMaterialUnitService.saveMaterialUnit(administratorId, materialUnitId, payload).pipe(
        tap({
          next: insertedMaterial => dispatch({ type: 'SAVE_MATERIAL_UNIT_SUCEEDED', payload: insertedMaterial }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SAVE_MATERIAL_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newMaterialUnitService ]);

  return materialUnitSave$.current;
};
