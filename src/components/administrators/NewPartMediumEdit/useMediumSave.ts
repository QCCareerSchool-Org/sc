import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewPartMediumEditPayload } from '@/services/administrators/newPartMediumService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type MediumSavePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  mediumId: string;
  processingState: State['form']['processingState'];
  payload: NewPartMediumEditPayload;
};

export const useMediumSave = (dispatch: Dispatch<Action>): Subject<MediumSavePayload> => {
  const router = useRouter();
  const { newPartMediumService } = useAdminServices();

  const mediumSave$ = useRef(new Subject<MediumSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_PART_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId, payload }) => {
        return newPartMediumService.savePartMedium(administratorId, schoolId, courseId, unitId, assignmentId, partId, mediumId, payload).pipe(
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
