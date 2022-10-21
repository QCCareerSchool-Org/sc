import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { MaterialEditPayload } from '@/services/administrators/materialService';
import { HttpServiceError } from '@/services/httpService';

export type MaterialSaveEvent = {
  processingState: State['form']['processingState'];
  administratorId: number;
  materialId: string;
  payload: MaterialEditPayload;
};

export const useMaterialSave = (dispatch: Dispatch<Action>): Subject<MaterialSaveEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const save$ = useRef(new Subject<MaterialSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_MATERIAL_STARTED' })),
      exhaustMap(({ administratorId, materialId, payload }) => {
        return materialService.saveMaterial(administratorId, materialId, payload).pipe(
          tap({
            next: material => dispatch({ type: 'SAVE_MATERIAL_SUCCEEDED', payload: material }),
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
              dispatch({ type: 'SAVE_MATERIAL_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, navigateToLogin ]);

  return save$.current;
};
