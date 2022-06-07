import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type InitializeNextUnitEvent = {
  processingState: State['form']['processingState'];
  studentId: number;
  courseId: number;
};

export const useInitializeNextUnit = (dispatch: Dispatch<Action>): Subject<InitializeNextUnitEvent> => {
  const router = useRouter();
  const { newUnitService } = useStudentServices();

  const initializeNextUnit$ = useRef(new Subject<InitializeNextUnitEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    initializeNextUnit$.current.pipe(
      filter(({ processingState }) => processingState !== 'initializing'),
      tap(() => dispatch({ type: 'INITIALIZE_UNIT_STARTED' })),
      switchMap(({ studentId, courseId }) => newUnitService.initializeNextUnit(studentId, courseId).pipe(
        tap({
          next: newUnit => {
            dispatch({ type: 'INITIALIZE_UNIT_SUCCEEDED', payload: newUnit });
            void router.push(router.asPath + '/units/' + newUnit.unitId);
          },
          error: err => {
            let message = 'Initialize failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'INITIALIZE_UNIT_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUnitService ]);

  return initializeNextUnit$.current;
};
