import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, courseId: number, submissionId: string): void => {
  const { newSubmissionService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newSubmissionService.getSubmission(studentId, courseId, submissionId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unit => dispatch({ type: 'LOAD_UNIT_SUCEEDED', payload: unit }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentId, courseId, submissionId, newSubmissionService, navigateToLogin ]);
};
