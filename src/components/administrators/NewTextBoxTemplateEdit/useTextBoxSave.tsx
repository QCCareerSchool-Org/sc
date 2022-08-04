import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewTextBoxTemplateSavePayload } from '@/services/administrators/newTextBoxTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewTextBoxTemplateSaveEvent = {
  administratorId: number;
  textBoxId: string;
  payload: NewTextBoxTemplateSavePayload;
  processingState: State['form']['processingState'];
};

export const useTextBoxSave = (dispatch: Dispatch<Action>): Subject<NewTextBoxTemplateSaveEvent> => {
  const { newTextBoxTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const textBoxSave$ = useRef(new Subject<NewTextBoxTemplateSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    textBoxSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, textBoxId, payload }) => {
        return newTextBoxTemplateService.saveTextBox(administratorId, textBoxId, payload).pipe(
          tap({
            next: updatedTextBox => {
              dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: updatedTextBox });
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
              dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, newTextBoxTemplateService, navigateToLogin ]);

  return textBoxSave$.current;
};
