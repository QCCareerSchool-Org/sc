import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useRefresh = (dispatch: Dispatch<Action>, studentId: number, courseId: number, materialId: string): Subject<void> => {
  const navigateToLogin = useNavigateToLogin();
  const { enrollmentService, materialService } = useStudentServices();

  const refresh$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    refresh$.current.pipe(
      switchMap(() => forkJoin({
        material: materialService.getMaterial(studentId, materialId),
        enrollment: enrollmentService.getEnrollment(studentId, courseId),
      })),
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

  return refresh$.current;
};
