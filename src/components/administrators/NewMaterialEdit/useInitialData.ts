import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, materialId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newMaterialService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newMaterialService.getMaterial(administratorId, materialId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: newMaterial => {
        dispatch({ type: 'LOAD_MATERIAL_SUCCEEDED', payload: newMaterial });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_MATERIAL_FAILED', payload: errorCode });
      },
    });
  }, [ administratorId, materialId, dispatch, router, newMaterialService ]);
};
