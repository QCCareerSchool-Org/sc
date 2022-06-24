import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, materialUnitId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newMaterialUnitService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newMaterialUnitService.getMaterialUnit(administratorId, materialUnitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: course => {
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: course });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });
  }, [ administratorId, materialUnitId, dispatch, router, newMaterialUnitService ]);
};
