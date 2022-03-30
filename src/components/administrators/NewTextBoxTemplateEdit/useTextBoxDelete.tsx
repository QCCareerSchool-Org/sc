import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type TextBoxDeletePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  textBoxId: string;
  processingState: State['form']['processingState'];
};

export const useTextBoxDelete = (dispatch: Dispatch<Action>): Subject<TextBoxDeletePayload> => {
  const router = useRouter();
  const { newTextBoxTemplateService } = useAdminServices();

  const textBoxDelete$ = useRef(new Subject<TextBoxDeletePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    textBoxDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId }) => {
        return newTextBoxTemplateService.deleteTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_SUCCEEDED' });
              router.back();
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_TEXT_BOX_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newTextBoxTemplateService ]);

  return textBoxDelete$.current;
};
