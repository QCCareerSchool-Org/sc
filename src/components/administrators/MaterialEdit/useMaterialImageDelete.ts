import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type MaterialImageDeleteEvent = {
  processingState: State['imageForm']['processingState'];
  administratorId: number;
  materialId: string;
};

export const useMaterialImageDelete = (dispatch: Dispatch<Action>): Subject<MaterialImageDeleteEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const delete$ = useRef(new Subject<MaterialImageDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    delete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_MATERIAL_IMAGE_STARTED' })),
      exhaustMap(({ administratorId, materialId }) => {
        return materialService.deleteMaterialImage(administratorId, materialId).pipe(
          tap({
            next: material => dispatch({ type: 'DELETE_MATERIAL_IMAGE_SUCCEEDED', payload: material }),
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
              dispatch({ type: 'DELETE_MATERIAL_IMAGE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, navigateToLogin ]);

  return delete$.current;
};
