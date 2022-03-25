import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { newAssignmentTemplateService } from '@/services/administrators';
import type { NewAssignmentTemplatePayload } from '@/services/administrators/newAssignmentTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type AssignementInsertPayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  processingState: State['newAssignmentTemplateForm']['processingState'];
  payload: NewAssignmentTemplatePayload;
};

export const useAssignmentInsert = (dispatch: Dispatch<Action>): Subject<AssignementInsertPayload> => {
  const router = useRouter();

  const assignmentInsert$ = useRef(new Subject<AssignementInsertPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    assignmentInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, payload }) => newAssignmentTemplateService.addAssignment(administratorId, schoolId, courseId, unitId, payload).pipe(
        tap({
          next: insertedAssignment => dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: insertedAssignment }),
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
            dispatch({ type: 'ADD_ASSIGNMENT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router ]);

  return assignmentInsert$.current;
};
