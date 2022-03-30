import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type MediumDeletePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  mediumId: string;
  processingState: State['form']['processingState'];
};

export const useMediumDelete = (dispatch: Dispatch<Action>): Subject<MediumDeletePayload> => {
  const router = useRouter();
  const { newPartMediumService } = useAdminServices();

  const mediumDelete$ = useRef(new Subject<MediumDeletePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_PART_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId }) => {
        return newPartMediumService.deletePartMedium(administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId).pipe(
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
