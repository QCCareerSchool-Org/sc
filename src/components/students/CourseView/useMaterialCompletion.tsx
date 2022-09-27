import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, mergeMap, Subject, takeUntil, tap } from 'rxjs';

import type { Action, MaterialWithCompletionForm } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type MaterialCompleteEvent = {
  studentId: number;
  enrollmentId: number;
  materialId: string;
  complete: boolean;
  processingState: MaterialWithCompletionForm['processingState'];
};

export const useMaterialCompletion = (dispatch: Dispatch<Action>): Subject<MaterialCompleteEvent> => {
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const { materialService } = useStudentServices();

  const completion$ = useRef(new Subject<MaterialCompleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    completion$.current.pipe(
      filter(({ processingState }) => processingState !== 'processing'),
      tap(({ materialId }) => dispatch({ type: 'MATERIAL_COMPLETION_STARTED', payload: materialId })),
      mergeMap(({ studentId, enrollmentId, materialId, complete }) => {

        const errorHandler = (err: unknown): void => {
          let message = 'Saving failed';
          if (err instanceof HttpServiceError) {
            if (err.login) {
              return void navigateToLogin();
            }
            if (err.message) {
              message = err.message;
            }
          }
          dispatch({ type: 'MATERIAL_COMPLETION_FAILED', payload: { materialId, errorMessage: message } });
        };

        if (complete) {
          return materialService.insertMaterialCompletion(studentId, enrollmentId, materialId).pipe(
            tap({
              next: materialCompletion => dispatch({ type: 'MATERIAL_COMPLETION_INSERTED', payload: materialCompletion }),
              error: errorHandler,
            }),
            catchError(() => EMPTY),
          );
        }

        return materialService.deleteMaterialCompletion(studentId, enrollmentId, materialId).pipe(
          tap({
            next: () => dispatch({ type: 'MATERIAL_COMPLETION_DELETED', payload: materialId }),
            error: errorHandler,
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, materialService, router, navigateToLogin ]);

  return completion$.current;
};
