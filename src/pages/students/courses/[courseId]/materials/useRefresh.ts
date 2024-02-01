import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { Subject, switchMap, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useRefresh = (dispatch: Dispatch<Action>, studentId: number, materialId: string): Subject<void> => {
  const navigateToLogin = useNavigateToLogin();
  const { materialService } = useStudentServices();

  const refresh$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    refresh$.current.pipe(
      switchMap(() => materialService.getMaterial(studentId, materialId)),
      takeUntil(destroy$),
    ).subscribe({
      next: material => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: material });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentId, materialId, materialService, navigateToLogin ]);

  return refresh$.current;
};
