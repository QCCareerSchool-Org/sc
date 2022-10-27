import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type MaterialContentReplaceEvent = {
  processingState: State['contentForm']['processingState'];
  administratorId: number;
  materialId: string;
  content: File;
};

export const useMaterialContentReplace = (dispatch: Dispatch<Action>): Subject<MaterialContentReplaceEvent> => {
  const { materialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const addOrReplace$ = useRef(new Subject<MaterialContentReplaceEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    addOrReplace$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'REPLACE_MATERIAL_CONTENT_STARTED' })),
      exhaustMap(({ administratorId, materialId, content }) => {
        return materialService.replaceMaterialContent(administratorId, materialId, content).pipe(
          tap({
            next: material => dispatch({ type: 'REPLACE_MATERIAL_CONTENT_SUCCEEDED', payload: material }),
            error: err => {
              let message = 'Replace failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'REPLACE_MATERIAL_CONTENT_FAILED', payload: message });
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
