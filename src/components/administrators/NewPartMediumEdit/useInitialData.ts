import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, mediumId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newPartMediumService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newPartMediumService.getPartMedium(administratorId, mediumId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newAssignmentMedium => {
        dispatch({ type: 'LOAD_PART_MEDIUM_SUCCEEDED', payload: newAssignmentMedium });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_PART_MEDIUM_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, mediumId, dispatch, router, newPartMediumService ]);
};
