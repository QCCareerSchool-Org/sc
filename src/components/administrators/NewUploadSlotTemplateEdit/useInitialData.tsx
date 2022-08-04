import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, uploadSlotId: string): void => {
  const { newUploadSlotTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUploadSlotTemplateService.getUploadSlot(administratorId, uploadSlotId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: uploadSlotTemplate => {
        dispatch({ type: 'LOAD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: uploadSlotTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UPLOAD_SLOT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, administratorId, uploadSlotId, newUploadSlotTemplateService, navigateToLogin ]);
};
