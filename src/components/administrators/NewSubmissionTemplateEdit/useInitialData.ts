import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): void => {
  const { newSubmissionTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newSubmissionTemplateService.getSubmission(administratorId, submissionId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unitTemplate => {
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_SUCCEEDED', payload: unitTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, submissionId, newSubmissionTemplateService, navigateToLogin ]);
};
