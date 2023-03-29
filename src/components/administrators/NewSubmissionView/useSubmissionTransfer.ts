import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

type SubmissionTransferEvent = {
  tutorId: number;
};

export const useSubmissionTransfer = (dispatch: Dispatch<Action>, administratorId: number, submissionId: string): Subject<SubmissionTransferEvent> => {
  const { studentService, newSubmissionService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const transfer$ = useRef(new Subject<SubmissionTransferEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    transfer$.current.pipe(
      tap(() => dispatch({ type: 'SUBMISSION_TRANSFER_STARTED' })),
      switchMap(({ tutorId }) => newSubmissionService.transferSubmission(administratorId, submissionId, tutorId)),
      takeUntil(destroy$),
    ).subscribe({
      next: submission => {
        dispatch({ type: 'SUBMISSION_TRANSFER_SUCCEEDED', payload: submission });
      },
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
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, submissionId, studentService, newSubmissionService, navigateToLogin ]);

  return transfer$.current;
};
