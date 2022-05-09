import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type NewAssignmentTemplateDeleteEvent = {
  administratorId: number;
  assignmentId: string;
  processingState: State['form']['processingState'];
};

export const useAssignmentDelete = (dispatch: Dispatch<Action>): Subject<NewAssignmentTemplateDeleteEvent> => {
  const router = useRouter();
  const { newAssignmentTemplateService } = useAdminServices();

  const assignmentDelete$ = useRef(new Subject<NewAssignmentTemplateDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    assignmentDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, assignmentId }) => {
        return newAssignmentTemplateService.deleteAssignment(administratorId, assignmentId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_SUCCEEDED' });
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
              dispatch({ type: 'DELETE_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newAssignmentTemplateService ]);

  return assignmentDelete$.current;
};
