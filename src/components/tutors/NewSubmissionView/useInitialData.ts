import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, tutorId: number, studentId: number, courseId: number, submissionId: string): void => {
  const navigateToLogin = useNavigateToLogin();
  const { newUnitService } = useTutorServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(tutorId, studentId, submissionId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newUnit => {
        dispatch({ type: 'LOAD_UNIT_SUCCEEDED', payload: newUnit });
      },
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
  }, [ dispatch, tutorId, studentId, submissionId, newUnitService, navigateToLogin ]);
};
