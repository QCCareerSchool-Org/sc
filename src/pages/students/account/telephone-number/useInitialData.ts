import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useServices } from '@/hooks/useServices';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, crmId: number): void => {
  const { crmTelephoneCountryCodeService } = useServices();
  const { crmStudentService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    forkJoin([
      crmStudentService.getCRMStudent(crmId),
      crmTelephoneCountryCodeService.getTelephoneCountryCodes(),
    ]).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: ([ crmStudent, crmTelephoneCountryCodes ]) => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: { crmStudent, crmTelephoneCountryCodes } }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmId, crmStudentService, crmTelephoneCountryCodeService, navigateToLogin ]);
};
