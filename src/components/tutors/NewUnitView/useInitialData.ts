import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (tutorId: number, studentId: number, courseId: number, unitId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newUnitService } = useTutorServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(tutorId, studentId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newUnit => {
        dispatch({ type: 'LOAD_UNIT_SUCCEEDED', payload: newUnit });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ tutorId, studentId, unitId, dispatch, router, newUnitService ]);
};
