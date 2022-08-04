import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewPartTemplateAddPayload } from '@/services/administrators/newPartTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewPartTemplateInsertEvent = {
  administratorId: number;
  payload: NewPartTemplateAddPayload;
  processingState: State['newPartTemplateForm']['processingState'];
};

export const usePartInsert = (dispatch: Dispatch<Action>): Subject<NewPartTemplateInsertEvent> => {
  const { newPartTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

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
                  return void navigateToLogin();
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
  }, [ dispatch, newPartTemplateService, navigateToLogin ]);

  return partInsert$.current;
};
