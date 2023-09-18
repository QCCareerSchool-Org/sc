import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type SubmissionSkipEvent = {
  studentId: number;
  courseId: number;
  submissionId: string;
  processingState: State['processingState'];
};

export const useSubmissionSkip = (dispatch: Dispatch<Action>): Subject<SubmissionSkipEvent> => {
  const { newSubmissionService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const skip$ = useRef(new Subject<SubmissionSkipEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    skip$.current.pipe(
      filter(({ processingState }) => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SKIP_STARTED' })),
      exhaustMap(({ studentId, courseId, submissionId }) => newSubmissionService.skipSubmission(studentId, courseId, submissionId).pipe(
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
  }, [ dispatch, newSubmissionService, navigateToLogin ]);

  return skip$.current;
};
