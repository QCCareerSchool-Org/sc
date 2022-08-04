import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, courseId: number): void => {
  const navigateToLogin = useNavigateToLogin();
  const { enrollmentService } = useStudentServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    enrollmentService.getEnrollment(studentId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: enrollment => {
        dispatch({ type: 'LOAD_ENROLLMENT_SUCCEEDED', payload: enrollment });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ENROLLMENT_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentId, courseId, enrollmentService, navigateToLogin ]);
};
