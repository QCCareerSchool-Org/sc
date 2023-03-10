import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { map, Subject, switchMap, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): void => {
  const { studentService, newSubmissionService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newSubmissionService.getSubmission(administratorId, submissionId).pipe(
      switchMap(newSubmission => studentService.getStudent(administratorId, newSubmission.enrollment.studentId).pipe(
        map(student => ({ newSubmission, student })),
      )),
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
  }, [ dispatch, administratorId, submissionId, studentService, newSubmissionService, navigateToLogin ]);
};
