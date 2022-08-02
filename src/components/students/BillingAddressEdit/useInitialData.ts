import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useServices } from '@/hooks/useServices';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, crmId: number): void => {
  const { crmStudentService } = useStudentServices();
  const { crmCountryService, crmProvinceService } = useServices();
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    forkJoin([
      crmStudentService.getCRMStudent(crmId),
      crmCountryService.getAllCRMCountries(),
    ]).pipe(
      switchMap(([ crmStudent, crmCountries ]) => crmProvinceService.getAllCRMProvincesByCountryCode(crmStudent.country.code).pipe(
        map(crmProvinces => ([ crmStudent, crmCountries, crmProvinces ] as const)),
      )),
      takeUntil(destroy$),
    ).subscribe({
      next: ([ crmStudent, crmCountries, crmProvinces ]) => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: { crmStudent, crmCountries, crmProvinces } }),
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

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmId, crmStudentService, crmCountryService, crmProvinceService, router ]);
};
