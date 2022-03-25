import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { newUnitTemplateService } from '@/services/administrators';
import type { NewUnitTemplatePayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type UnitInsertPayload = {
  processingState: State['newUnitTemplateForm']['processingState'];
  administratorId: number;
  schoolId: number;
  courseId: number;
  payload: NewUnitTemplatePayload;
};

export const useUnitInsert = (dispatch: Dispatch<Action>): Subject<UnitInsertPayload> => {
  const router = useRouter();

  const unitInsert$ = useRef(new Subject<UnitInsertPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, payload }) => newUnitTemplateService.addUnit(administratorId, schoolId, courseId, payload).pipe(
        tap({
          next: insertedUnit => dispatch({ type: 'ADD_UNIT_TEMPLATE_SUCCEEDED', payload: insertedUnit }),
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
            dispatch({ type: 'ADD_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router ]);

  return unitInsert$.current;
};
