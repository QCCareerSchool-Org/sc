import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewUnitTemplateAddPayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitTemplateInsertEvent = {
  administratorId: number;
  payload: NewUnitTemplateAddPayload;
  processingState: State['newUnitTemplateForm']['processingState'];
};

export const useUnitInsert = (dispatch: Dispatch<Action>): Subject<NewUnitTemplateInsertEvent> => {
  const router = useRouter();
  const { newUnitTemplateService } = useAdminServices();

  const unitInsert$ = useRef(new Subject<NewUnitTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => newUnitTemplateService.addUnit(administratorId, payload).pipe(
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
  }, [ dispatch, router, newUnitTemplateService ]);

  return unitInsert$.current;
};
