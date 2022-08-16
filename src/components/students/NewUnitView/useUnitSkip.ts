import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type UnitSkipEvent = {
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
};

export const useUnitSkip = (dispatch: Dispatch<Action>): Subject<UnitSkipEvent> => {
  const { newUnitService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const skip$ = useRef(new Subject<UnitSkipEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    skip$.current.pipe(
      filter(({ processingState }) => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SKIP_STARTED' })),
      exhaustMap(({ studentId, courseId, unitId }) => newUnitService.skipUnit(studentId, courseId, unitId).pipe(
        tap({
          next: () => dispatch({ type: 'SKIP_SUCEEDED' }),
          error: err => {
            let message = 'Skip failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SKIP_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitService, navigateToLogin ]);

  return skip$.current;
};
