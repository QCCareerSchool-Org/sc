import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, uploadSlotId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newUploadSlotTemplateService } = useAdminServices();

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
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UPLOAD_SLOT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, uploadSlotId, dispatch, router, newUploadSlotTemplateService ]);
};
