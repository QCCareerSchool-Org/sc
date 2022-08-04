import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewMaterialInsertPayload } from '@/services/administrators/newMaterialService';
import { HttpServiceError } from '@/services/httpService';

export type NewMaterialInsertEvent = {
  processingState: State['newMaterialForm']['processingState'];
  administratorId: number;
  payload: NewMaterialInsertPayload;
  content: File | null;
  image: File | null;
};

export const useMaterialInsert = (dispatch: Dispatch<Action>): Subject<NewMaterialInsertEvent> => {
  const { newMaterialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const materialInsert$ = useRef(new Subject<NewMaterialInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_MATERIAL_STARTED' })),
      exhaustMap(({ administratorId, payload, content, image }) => {
        return newMaterialService.addMaterialFile(administratorId, payload, content, image).pipe(
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
  }, [ dispatch, newMaterialService, navigateToLogin ]);

  return materialInsert$.current;
};
