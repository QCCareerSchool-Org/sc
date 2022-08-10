import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, administratorId: number, materialId: string): void => {
  const { newMaterialService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

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
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_MATERIAL_FAILED', payload: errorCode });
      },
    });
  }, [ dispatch, administratorId, materialId, newMaterialService, navigateToLogin ]);
};
