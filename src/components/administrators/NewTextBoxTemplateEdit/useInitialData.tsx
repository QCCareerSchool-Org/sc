import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (administratorId: number, schoolId: number, courseId: number, unitId: string, assignmentId: string, partId: string, textBoxId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newTextBoxTemplateService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newTextBoxTemplateService.getTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: textBoxTemplate => {
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, dispatch, router, newTextBoxTemplateService ]);
};
