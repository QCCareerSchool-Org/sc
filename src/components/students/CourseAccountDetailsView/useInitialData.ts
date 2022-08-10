import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, crmId: number, crmEnrollmentId: number): void => {
  const { crmEnrollmentService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    crmEnrollmentService.getCRMEnrollment(crmId, crmEnrollmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: crmEnrollment => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: crmEnrollment }),
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
  }, [ dispatch, crmId, crmEnrollmentId, crmEnrollmentService, navigateToLogin ]);
};
