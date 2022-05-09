import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewTextBoxTemplateAddPayload } from '@/services/administrators/newTextBoxTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewTextBoxTemplateInsertEvent = {
  administratorId: number;
  payload: NewTextBoxTemplateAddPayload;
  processingState: State['newTextBoxTemplateForm']['processingState'];
};

export const useTextBoxInsert = (dispatch: Dispatch<Action>): Subject<NewTextBoxTemplateInsertEvent> => {
  const router = useRouter();
  const { newTextBoxTemplateService } = useAdminServices();

  const textBoxInsert$ = useRef(new Subject<NewTextBoxTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    textBoxInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => {
        return newTextBoxTemplateService.addTextBox(administratorId, payload).pipe(
          tap({
            next: insertedTextBox => {
              dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: insertedTextBox });
            },
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
              dispatch({ type: 'ADD_TEXT_BOX_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newTextBoxTemplateService ]);

  return textBoxInsert$.current;
};
