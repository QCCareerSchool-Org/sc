import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewSubmissionTemplateAddPayload } from '@/services/administrators/newSubmissionTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewSubmissionTemplateInsertEvent = {
  administratorId: number;
  payload: NewSubmissionTemplateAddPayload;
  processingState: State['newSubmissionTemplateForm']['processingState'];
};

export const useSubmissionTemplateInsert = (dispatch: Dispatch<Action>): Subject<NewSubmissionTemplateInsertEvent> => {
  const { newSubmissionTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const insert$ = useRef(new Subject<NewSubmissionTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    insert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_SUBMISSION_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => newSubmissionTemplateService.addSubmission(administratorId, payload).pipe(
        tap({
          next: insertedUnit => dispatch({ type: 'ADD_SUBMISSION_TEMPLATE_SUCCEEDED', payload: insertedUnit }),
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
            dispatch({ type: 'ADD_SUBMISSION_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newSubmissionTemplateService, navigateToLogin ]);

  return insert$.current;
};
