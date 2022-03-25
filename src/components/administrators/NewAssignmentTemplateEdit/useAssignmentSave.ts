import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type AssignmentSavePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  processingState: State['form']['processingState'];
  payload: NewAssignmentTemplatePayload;
};

export const useAssignmentSave = (dispatch: Dispatch<Action>): Subject<AssignmentSavePayload> => {
  const router = useRouter();
  const { newAssignmentTemplateService } = useAdminServices();

  const assignmentSave$ = useRef(new Subject<AssignmentSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    assignmentSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, payload }) => {
        return newAssignmentTemplateService.saveAssignment(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
          tap({
            next: updatedAssignment => {
              dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
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
              dispatch({ type: 'SAVE_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newAssignmentTemplateService ]);

  return assignmentSave$.current;
};
