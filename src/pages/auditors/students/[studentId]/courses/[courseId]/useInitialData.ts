import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAuditorServices } from '@/hooks/useAuditorServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, auditorId: number, studentId: number, courseId: number): void => {
  const { studentService } = useAuditorServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    studentService.getEnrollment(auditorId, studentId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: enrollment => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: enrollment }),
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
  }, [ dispatch, auditorId, studentId, courseId, studentService, navigateToLogin ]);
};
