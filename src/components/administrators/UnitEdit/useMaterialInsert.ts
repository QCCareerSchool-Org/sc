import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { MaterialInsertPayload } from '@/services/administrators/materialService';
import { HttpServiceError } from '@/services/httpService';

export type NewMaterialInsertEvent = {
  processingState: State['materialForm']['processingState'];
  administratorId: number;
  payload: MaterialInsertPayload;
  content: File | null;
  image: File | null;
};

export const useMaterialInsert = (dispatch: Dispatch<Action>): Subject<NewMaterialInsertEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const materialInsert$ = useRef(new Subject<NewMaterialInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_MATERIAL_STARTED' })),
      exhaustMap(({ administratorId, payload, content, image }) => {
        return materialService.addMaterial(administratorId, payload, content, image).pipe(
          tap({
            next: response => {
              if (response.type === 'progress') {
                dispatch({ type: 'ADD_MATERIAL_PROGRESSED', payload: response.value });
              } else {
                dispatch({ type: 'ADD_MATERIAL_SUCCEEDED', payload: response.value });
              }
            },
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
              dispatch({ type: 'ADD_MATERIAL_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, navigateToLogin ]);

  return materialInsert$.current;
};
