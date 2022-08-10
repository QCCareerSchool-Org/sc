import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewPartMediumAddPayload } from '@/services/administrators/newPartMediumService';
import { HttpServiceError } from '@/services/httpService';

export type NewPartMediumInsertEvent = {
  administratorId: number;
  payload: NewPartMediumAddPayload;
  processingState: State['partMediaForm']['processingState'];
};

export const useMediumInsert = (dispatch: Dispatch<Action>): Subject<NewPartMediumInsertEvent> => {
  const { newPartMediumService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const mediumInsert$ = useRef(new Subject<NewPartMediumInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_PART_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, payload }) => {
        return newPartMediumService.addPartMedium(administratorId, payload).pipe(
          tap({
            next: progressResponse => {
              if (progressResponse.type === 'progress') {
                dispatch({ type: 'ADD_PART_MEDIUM_PROGRESSED', payload: progressResponse.value });
              } else if (progressResponse.type === 'data') {
                dispatch({ type: 'ADD_PART_MEDIUM_SUCCEEDED', payload: progressResponse.value });
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
              dispatch({ type: 'ADD_PART_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newPartMediumService, navigateToLogin ]);

  return mediumInsert$.current;
};
