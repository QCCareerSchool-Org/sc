import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type MaterialDeleteEvent = {
  processingState: State['detailsForm']['processingState'];
  administratorId: number;
  materialId: string;
};

export const useMaterialDelete = (dispatch: Dispatch<Action>): Subject<MaterialDeleteEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

  const delete$ = useRef(new Subject<MaterialDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    delete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_MATERIAL_STARTED' })),
      exhaustMap(({ administratorId, materialId }) => {
        return materialService.deleteMaterial(administratorId, materialId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_MATERIAL_SUCCEEDED' });
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
              dispatch({ type: 'DELETE_MATERIAL_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, navigateToLogin, router ]);

  return delete$.current;
};
