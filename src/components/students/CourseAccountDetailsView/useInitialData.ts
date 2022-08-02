import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, crmId: number, crmEnrollmentId: number): void => {
  const { crmEnrollmentService } = useStudentServices();
  const router = useRouter();

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
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmId, crmEnrollmentId, crmEnrollmentService, router ]);
};
