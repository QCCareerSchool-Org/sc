import { useEffect } from 'react';
import type { Dispatch } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, submissionReturnId: string): void => {
  const { newSubmissionReturnService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newSubmissionReturnService.getSubmissionReturn(administratorId, submissionReturnId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newSubmissionReturn => {
        dispatch({ type: 'LOAD_UNIT_RETURN_SUCEEDED', payload: newSubmissionReturn });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_RETURN_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, submissionReturnId, newSubmissionReturnService, navigateToLogin ]);
};
