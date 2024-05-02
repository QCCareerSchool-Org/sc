import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

type SubmissionRestartEvent = {
  processingState: State['restartForm']['processingState'];
};

export const useSubmissionRestart = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): Subject<SubmissionRestartEvent> => {
  const { studentService, newSubmissionService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const transfer$ = useRef(new Subject<SubmissionRestartEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    transfer$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'save error'),
      tap(() => dispatch({ type: 'SUBMISSION_RESTART_STARTED' })),
      switchMap(() => {
        return newSubmissionService.restartSubmission(administratorId, submissionId).pipe(
          tap({
            next: restartedSubmission => dispatch({ type: 'SUBMISSION_RESTART_SUCCEEDED', payload: restartedSubmission }),
            error: err => {
              let message = 'Transfer failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SUBMISSION_RESTART_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, submissionId, studentService, newSubmissionService, navigateToLogin ]);

  return transfer$.current;
};
