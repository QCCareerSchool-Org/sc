import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewAssignmentMediumAddPayload } from '@/services/administrators/newAssignmentMediumService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type MediumInsertPayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  processingState: State['assignmentMediaForm']['processingState'];
  payload: NewAssignmentMediumAddPayload;
};

export const useMediumInsert = (dispatch: Dispatch<Action>): Subject<MediumInsertPayload> => {
  const router = useRouter();
  const { newAssignmentMediumService } = useAdminServices();

  const mediumInsert$ = useRef(new Subject<MediumInsertPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    mediumInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, payload }) => {
        return newAssignmentMediumService.addAssignmentMedium(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
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
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'ADD_ASSIGNMENT_MEDIUM_FAILED', payload: message });
              console.log(err);
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newAssignmentMediumService ]);

  return mediumInsert$.current;
};
