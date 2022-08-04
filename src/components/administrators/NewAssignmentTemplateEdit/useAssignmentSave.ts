import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewAssignmentTemplateSavePayload } from '@/services/administrators/newAssignmentTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewAssignmentTemplateSaveEvent = {
  administratorId: number;
  assignmentId: string;
  payload: NewAssignmentTemplateSavePayload;
  processingState: State['form']['processingState'];
};

export const useAssignmentSave = (dispatch: Dispatch<Action>): Subject<NewAssignmentTemplateSaveEvent> => {
  const { newAssignmentTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const assignmentSave$ = useRef(new Subject<NewAssignmentTemplateSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    assignmentSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, assignmentId, payload }) => {
        return newAssignmentTemplateService.saveAssignment(administratorId, assignmentId, payload).pipe(
          tap({
            next: updatedAssignment => {
              dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newAssignmentTemplateService, navigateToLogin ]);

  return assignmentSave$.current;
};
