import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type SubmissionSubmitEvent = {
  studentId: number;
  courseId: number;
  submissionId: string;
  processingState: State['processingState'];
};

export const useSubmissionSubmit = (dispatch: Dispatch<Action>): Subject<SubmissionSubmitEvent> => {
  const { newSubmissionService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const submit$ = useRef(new Subject<SubmissionSubmitEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    submit$.current.pipe(
      filter(({ processingState }) => processingState !== 'submitting' && processingState !== 'skipping'),
      tap(() => dispatch({ type: 'SUBMIT_STARTED' })),
      exhaustMap(({ studentId, courseId, submissionId }) => newSubmissionService.submitSubmission(studentId, courseId, submissionId).pipe(
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
  }, [ dispatch, newSubmissionService, navigateToLogin ]);

  return submit$.current;
};
