import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type UnitSubmitEvent = {
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
};

export const useUnitSubmit = (dispatch: Dispatch<Action>): Subject<UnitSubmitEvent> => {
  const { newUnitService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const skip$ = useRef(new Subject<UnitSubmitEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    skip$.current.pipe(
      filter(({ processingState }) => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SUBMIT_STARTED' })),
      exhaustMap(({ studentId, courseId, unitId }) => newUnitService.submitUnit(studentId, courseId, unitId).pipe(
        tap({
          next: () => dispatch({ type: 'SUBMIT_SUCCEEDED' }),
          error: err => {
            let message = 'Submit failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SUBMIT_FAILED', payload: message });
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
