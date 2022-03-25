import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewPartTemplatePayload } from '@/services/administrators/newPartTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type PartInsertPayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  processingState: State['newPartTemplateForm']['processingState'];
  payload: NewPartTemplatePayload;
};

export const usePartInsert = (dispatch: Dispatch<Action>): Subject<PartInsertPayload> => {
  const router = useRouter();
  const { newPartTemplateService } = useAdminServices();

  const partInsert$ = useRef(new Subject<PartInsertPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    partInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, payload }) => {
        return newPartTemplateService.addPart(administratorId, schoolId, courseId, unitId, assignmentId, payload).pipe(
          tap({
            next: insertedPart => dispatch({ type: 'ADD_PART_TEMPLATE_SUCCEEDED', payload: insertedPart }),
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
              dispatch({ type: 'ADD_PART_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newPartTemplateService ]);

  return partInsert$.current;
};
