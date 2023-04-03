import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

type SubmissionTransferEvent = {
  tutorId: number | null;
  processingState: State['form']['processingState'];
};

export const useSubmissionTransfer = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): Subject<SubmissionTransferEvent> => {
  const { studentService, newSubmissionService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const transfer$ = useRef(new Subject<SubmissionTransferEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    transfer$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'save error'),
      tap(() => dispatch({ type: 'SUBMISSION_TRANSFER_STARTED' })),
      switchMap(({ tutorId }) => {
        if (tutorId === null) {
          dispatch({ type: 'SUBMISSION_TRANSFER_FAILED', payload: 'No tutor selected' });
          return EMPTY;
        }
        return newSubmissionService.transferSubmission(administratorId, submissionId, tutorId).pipe(
          tap({
            next: transfer => dispatch({ type: 'SUBMISSION_TRANSFER_SUCCEEDED', payload: transfer }),
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
              dispatch({ type: 'SUBMISSION_TRANSFER_FAILED', payload: message });
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
