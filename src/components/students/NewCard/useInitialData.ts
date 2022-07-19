import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (crmId: number, dispatch: Dispatch<Action>): void => {
  const { crmEnrollmentService } = useStudentServices();
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    crmEnrollmentService.getCRMEnrollments(crmId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: enrollments => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: enrollments }),
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
  }, [ crmId, dispatch, crmEnrollmentService, router ]);
};
