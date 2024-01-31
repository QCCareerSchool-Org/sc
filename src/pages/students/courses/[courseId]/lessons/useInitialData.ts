import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, materialId: string): void => {
  const navigateToLogin = useNavigateToLogin();
  const { materialService } = useStudentServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    materialService.getMaterial(studentId, materialId).pipe(
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
};
