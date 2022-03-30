import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewTextBoxTemplatePayload } from '@/services/administrators/newTextBoxTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type TextBoxSavePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  textBoxId: string;
  processingState: State['form']['processingState'];
  payload: NewTextBoxTemplatePayload;
};

export const useTextBoxSave = (dispatch: Dispatch<Action>): Subject<TextBoxSavePayload> => {
  const router = useRouter();
  const { newTextBoxTemplateService } = useAdminServices();

  const textBoxSave$ = useRef(new Subject<TextBoxSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    textBoxSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, payload }) => {
        return newTextBoxTemplateService.saveTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, payload).pipe(
          tap({
            next: updatedTextBox => {
              dispatch({ type: 'SAVE_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: updatedTextBox });
            },
            error: err => {
              let message = 'Save failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
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
  }, [ dispatch, router, newTextBoxTemplateService ]);

  return textBoxSave$.current;
};
