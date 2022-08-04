import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewAssignmentMediumAddPayload } from '@/services/administrators/newAssignmentMediumService';
import { HttpServiceError } from '@/services/httpService';

export type NewAssignmentMediumInsertEvent = {
  administratorId: number;
  payload: NewAssignmentMediumAddPayload;
  processingState: State['assignmentMediaForm']['processingState'];
};

export const useMediumInsert = (dispatch: Dispatch<Action>): Subject<NewAssignmentMediumInsertEvent> => {
  const { newAssignmentMediumService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const mediumInsert$ = useRef(new Subject<NewAssignmentMediumInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, payload }) => {
        return newAssignmentMediumService.addAssignmentMedium(administratorId, payload).pipe(
          tap({
            next: progressResponse => {
              if (progressResponse.type === 'progress') {
                dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_PROGRESSED', payload: progressResponse.value });
              } else if (progressResponse.type === 'data') {
                dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_SUCCEEDED', payload: progressResponse.value });
              }
            },
            error: err => {
              let message = 'Insert failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newAssignmentMediumService, navigateToLogin ]);

  return mediumInsert$.current;
};
