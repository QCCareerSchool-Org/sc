import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type NewPartMediumDeleteEvent = {
  administratorId: number;
  mediumId: string;
  processingState: State['form']['processingState'];
};

export const useMediumDelete = (dispatch: Dispatch<Action>): Subject<NewPartMediumDeleteEvent> => {
  const router = useRouter();
  const { newPartMediumService } = useAdminServices();

  const mediumDelete$ = useRef(new Subject<NewPartMediumDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_PART_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, mediumId }) => {
        return newPartMediumService.deletePartMedium(administratorId, mediumId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_PART_MEDIUM_SUCCEEDED' });
              router.back();
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_PART_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newPartMediumService ]);

  return mediumDelete$.current;
};
