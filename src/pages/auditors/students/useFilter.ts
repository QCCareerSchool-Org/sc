import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAuditorServices } from '@/hooks/useAuditorServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type StudentFilterEvent = {
  auditorId: number;
  name: string;
  group: string;
  location: string;
  processingState: State['form']['processingState'];
};

export const useFilter = (dispatch: Dispatch<Action>): Subject<StudentFilterEvent> => {
  const navigateToLogin = useNavigateToLogin();
  const { studentService } = useAuditorServices();

  const filter$ = useRef(new Subject<StudentFilterEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    filter$.current.pipe(
      tap(() => dispatch({ type: 'FILTER_STARTED' })),
      switchMap(event => studentService.getAllStudents(event.auditorId, { name: event.name, group: event.group, location: event.location }).pipe(
        tap({
          next: students => dispatch({ type: 'FILTER_SUCCEEDED', payload: students }),
          error: err => {
            let message = 'Filter failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'FILTER_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentService, navigateToLogin ]);

  return filter$.current;
};
