import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, courseId: number, materialId: string): void => {
  const navigateToLogin = useNavigateToLogin();
  const { enrollmentService, materialService } = useStudentServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    forkJoin({
      material: materialService.getMaterial(studentId, materialId),
      enrollment: enrollmentService.getEnrollment(studentId, courseId),
    }).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: data => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: data });
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
  }, [ dispatch, studentId, courseId, materialId, materialService, enrollmentService, navigateToLogin ]);
};
