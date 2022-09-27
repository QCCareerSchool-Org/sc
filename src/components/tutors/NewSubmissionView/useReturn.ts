import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type ReturnPayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  submissionId: string;
  comment: string;
  processingState: State['processingState'];
};

export const useReturn = (dispatch: Dispatch<Action>): Subject<ReturnPayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { newUnitService } = useTutorServices();

  const return$ = useRef(new Subject<ReturnPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    return$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'delete error' || processingState === 'close error' || processingState === 'return error'),
      tap(() => dispatch({ type: 'RETURN_UNIT_STARTED' })),
      exhaustMap(({ tutorId, studentId, submissionId, comment }) => {
        return newUnitService.returnUnit(tutorId, studentId, submissionId, comment).pipe(
          tap({
            next: newUnit => {
              dispatch({ type: 'RETURN_UNIT_SUCCEEDED', payload: newUnit });
            },
            error: err => {
              let message = 'Return failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'RETURN_UNIT_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newUnitService, navigateToLogin ]);

  return return$.current;
};
