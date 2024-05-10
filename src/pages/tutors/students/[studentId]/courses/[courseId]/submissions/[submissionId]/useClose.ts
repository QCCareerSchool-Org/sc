import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type ClosePayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  submissionId: string;
  processingState: State['processingState'];
};

export const useClose = (dispatch: Dispatch<Action>): Subject<ClosePayload> => {
  const navigateToLogin = useNavigateToLogin();
  const { newSubmissionService } = useTutorServices();

  const close$ = useRef(new Subject<ClosePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    close$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'delete error' || processingState === 'close error' || processingState === 'return error'),
      tap(() => dispatch({ type: 'CLOSE_UNIT_STARTED' })),
      exhaustMap(({ tutorId, studentId, submissionId }) => {
        return newSubmissionService.closeSubmission(tutorId, studentId, submissionId).pipe(
          tap({
            next: newUnit => {
              dispatch({ type: 'CLOSE_UNIT_SUCCEEDED', payload: newUnit });
            },
            error: err => {
              let message = 'Close failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'CLOSE_UNIT_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newSubmissionService, navigateToLogin ]);

  return close$.current;
};
