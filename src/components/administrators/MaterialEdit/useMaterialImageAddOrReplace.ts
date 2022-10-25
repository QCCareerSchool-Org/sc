import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type MaterialImageAddOrReplaceEvent = {
  processingState: State['imageForm']['processingState'];
  administratorId: number;
  materialId: string;
  image: File;
};

export const useMaterialImageAddOrReplace = (dispatch: Dispatch<Action>): Subject<MaterialImageAddOrReplaceEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const addOrReplace$ = useRef(new Subject<MaterialImageAddOrReplaceEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    addOrReplace$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'REPLACE_MATERIAL_IMAGE_STARTED' })),
      exhaustMap(({ administratorId, materialId, image }) => {
        return materialService.replaceMaterialImage(administratorId, materialId, image).pipe(
          tap({
            next: material => dispatch({ type: 'REPLACE_MATERIAL_IMAGE_SUCCEEDED', payload: material }),
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
              dispatch({ type: 'REPLACE_MATERIAL_IMAGE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, navigateToLogin ]);

  return addOrReplace$.current;
};
