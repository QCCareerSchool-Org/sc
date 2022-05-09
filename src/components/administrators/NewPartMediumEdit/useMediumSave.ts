import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewPartMediumSavePayload } from '@/services/administrators/newPartMediumService';
import { HttpServiceError } from '@/services/httpService';

export type NewPartMediumSaveEvent = {
  administratorId: number;
  mediumId: string;
  payload: NewPartMediumSavePayload;
  processingState: State['form']['processingState'];
};

export const useMediumSave = (dispatch: Dispatch<Action>): Subject<NewPartMediumSaveEvent> => {
  const router = useRouter();
  const { newPartMediumService } = useAdminServices();

  const mediumSave$ = useRef(new Subject<NewPartMediumSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_PART_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, mediumId, payload }) => {
        return newPartMediumService.savePartMedium(administratorId, mediumId, payload).pipe(
          tap({
            next: updatedAssignmentMedium => {
              dispatch({ type: 'SAVE_PART_MEDIUM_SUCCEEDED', payload: updatedAssignmentMedium });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SAVE_PART_MEDIUM_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newPartMediumService ]);

  return mediumSave$.current;
};
