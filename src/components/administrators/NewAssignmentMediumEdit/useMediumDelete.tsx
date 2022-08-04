import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type AssignmentMediumDeleteEvent = {
  administratorId: number;
  mediumId: string;
  processingState: State['form']['processingState'];
};

export const useMediumDelete = (dispatch: Dispatch<Action>): Subject<AssignmentMediumDeleteEvent> => {
  const { newAssignmentMediumService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

  const mediumDelete$ = useRef(new Subject<AssignmentMediumDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, mediumId }) => {
        return newAssignmentMediumService.deleteAssignmentMedium(administratorId, mediumId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_SUCCEEDED' });
              router.back();
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_ASSIGNMENT_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newAssignmentMediumService, navigateToLogin, router ]);

  return mediumDelete$.current;
};
