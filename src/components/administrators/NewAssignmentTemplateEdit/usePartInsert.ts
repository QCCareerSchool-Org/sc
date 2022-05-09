import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewPartTemplateAddPayload } from '@/services/administrators/newPartTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewPartTemplateInsertEvent = {
  administratorId: number;
  payload: NewPartTemplateAddPayload;
  processingState: State['newPartTemplateForm']['processingState'];
};

export const usePartInsert = (dispatch: Dispatch<Action>): Subject<NewPartTemplateInsertEvent> => {
  const router = useRouter();
  const { newPartTemplateService } = useAdminServices();

  const partInsert$ = useRef(new Subject<NewPartTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    partInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => {
        return newPartTemplateService.addPart(administratorId, payload).pipe(
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
