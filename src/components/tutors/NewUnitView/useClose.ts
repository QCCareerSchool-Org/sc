import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useTutorServices } from '@/hooks/useTutorServices';
import { HttpServiceError } from '@/services/httpService';

export type ClosePayload = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
};

export const useClose = (dispatch: Dispatch<Action>): Subject<ClosePayload> => {
  const router = useRouter();
  const { newUnitService } = useTutorServices();

  const close$ = useRef(new Subject<ClosePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    close$.current.pipe(
      filter(({ processingState }) => processingState === 'idle' || processingState === 'upload error' || processingState === 'delete error' || processingState === 'close error' || processingState === 'return error'),
      tap(() => dispatch({ type: 'CLOSE_UNIT_STARTED' })),
      exhaustMap(({ tutorId, studentId, unitId }) => {
        return newUnitService.closeUnit(tutorId, studentId, unitId).pipe(
          tap({
            next: newUnit => {
              dispatch({ type: 'CLOSE_UNIT_SUCCEEDED', payload: newUnit });
            },
            error: err => {
              let message = 'Close failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'CLOSE_UNIT_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUnitService ]);

  return close$.current;
};
