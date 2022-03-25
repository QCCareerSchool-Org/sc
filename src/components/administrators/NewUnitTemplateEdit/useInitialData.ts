import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useInitialData = (administratorId: number, schoolId: number, courseId: number, unitId: string, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { newUnitTemplateService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newUnitTemplateService.getUnit(administratorId, schoolId, courseId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: unitTemplate => {
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_SUCCEEDED', payload: unitTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_UNIT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, schoolId, courseId, unitId, dispatch, router, newUnitTemplateService ]);
};
