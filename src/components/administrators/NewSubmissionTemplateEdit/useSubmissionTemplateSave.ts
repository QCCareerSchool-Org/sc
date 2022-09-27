import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewSubmissionTemplateSavePayload } from '@/services/administrators/newSubmissionTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewSubmissionTemplateSaveEvent = {
  administratorId: number;
  submissionId: string;
  payload: NewSubmissionTemplateSavePayload;
  processingState: State['form']['processingState'];
};

export const useSubmissionTemplateSave = (dispatch: Dispatch<Action>): Subject<NewSubmissionTemplateSaveEvent> => {
  const { newSubmissionTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const save$ = useRef(new Subject<NewSubmissionTemplateSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    save$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, submissionId, payload }) => newSubmissionTemplateService.saveSubmission(administratorId, submissionId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
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
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newSubmissionTemplateService, navigateToLogin ]);

  return save$.current;
};
