import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, textBoxId: string): void => {
  const { newTextBoxTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newTextBoxTemplateService.getTextBox(administratorId, textBoxId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: textBoxTemplate => {
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_TEXT_BOX_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, textBoxId, newTextBoxTemplateService, navigateToLogin ]);
};
