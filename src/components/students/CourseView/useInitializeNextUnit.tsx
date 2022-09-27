import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type InitializeNextUnitEvent = {
  processingState: State['form']['processingState'];
  studentId: number;
  courseId: number;
};

export const useInitializeNextUnit = (dispatch: Dispatch<Action>): Subject<InitializeNextUnitEvent> => {
  const router = useRouter();
  const navigateToLogin = useNavigateToLogin();
  const { newSubmissionService } = useStudentServices();

  const initializeNextUnit$ = useRef(new Subject<InitializeNextUnitEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    initializeNextUnit$.current.pipe(
      filter(({ processingState }) => processingState !== 'initializing'),
      tap(() => dispatch({ type: 'INITIALIZE_UNIT_STARTED' })),
      switchMap(({ studentId, courseId }) => newSubmissionService.initializeNextUnit(studentId, courseId).pipe(
        tap({
          next: newSubmission => {
            dispatch({ type: 'INITIALIZE_UNIT_SUCCEEDED', payload: newSubmission });
            void router.push(router.asPath + '/units/' + newSubmission.submissionId);
          },
          error: err => {
            let message = 'Initialize failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
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
  }, [ dispatch, newSubmissionService, router, navigateToLogin ]);

  return initializeNextUnit$.current;
};
