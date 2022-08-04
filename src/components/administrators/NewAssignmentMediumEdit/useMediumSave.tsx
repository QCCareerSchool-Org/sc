import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewAssignmentMediumSavePayload } from '@/services/administrators/newAssignmentMediumService';
import { HttpServiceError } from '@/services/httpService';

export type AssignmentMediumSaveEvent = {
  administratorId: number;
  mediumId: string;
  processingState: State['form']['processingState'];
  payload: NewAssignmentMediumSavePayload;
};

export const useMediumSave = (dispatch: Dispatch<Action>): Subject<AssignmentMediumSaveEvent> => {
  const { newAssignmentMediumService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const mediumSave$ = useRef(new Subject<AssignmentMediumSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, mediumId, payload }) => {
        return newAssignmentMediumService.saveAssignmentMedium(administratorId, mediumId, payload).pipe(
          tap({
            next: updatedAssignmentMedium => {
              dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: updatedAssignmentMedium });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SAVE_ASSIGNMENT_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newAssignmentMediumService, navigateToLogin ]);

  return mediumSave$.current;
};
