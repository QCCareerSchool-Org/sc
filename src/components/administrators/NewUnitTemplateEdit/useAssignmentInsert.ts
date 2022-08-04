import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewAssignmentTemplateAddPayload } from '@/services/administrators/newAssignmentTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewAssignementTemplateInsertEvent = {
  administratorId: number;
  payload: NewAssignmentTemplateAddPayload;
  processingState: State['newAssignmentTemplateForm']['processingState'];
};

export const useAssignmentInsert = (dispatch: Dispatch<Action>): Subject<NewAssignementTemplateInsertEvent> => {
  const { newAssignmentTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const assignmentInsert$ = useRef(new Subject<NewAssignementTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    assignmentInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => newAssignmentTemplateService.addAssignment(administratorId, payload).pipe(
        tap({
          next: insertedAssignment => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: insertedAssignment }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newAssignmentTemplateService, navigateToLogin ]);

  return assignmentInsert$.current;
};
