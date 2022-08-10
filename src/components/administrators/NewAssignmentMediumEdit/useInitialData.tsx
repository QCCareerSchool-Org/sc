import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, mediumId: string): void => {
  const { newAssignmentMediumService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newAssignmentMediumService.getAssignmentMedium(administratorId, mediumId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignmentMedium => {
        dispatch({ type: 'LOAD_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: newAssignmentMedium });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_MEDIUM_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, mediumId, newAssignmentMediumService, navigateToLogin ]);
};
