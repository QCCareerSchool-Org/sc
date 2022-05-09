import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (administratorId: number, courseId: number, countryId: number | null, dispatch: Dispatch<Action>): void => {
  const router = useRouter();
  const { courseService, currencyService } = useAdminServices();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    dispatch({ type: 'LOAD_DATA_STARTED' });
    forkJoin([
      currencyService.getAllCurrencies(administratorId),
      courseService.getCourse(administratorId, courseId),
    ]).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: ([ currencies, course ]) => {
        const payload = {
          currencies,
          course,
          formData: course.newUnitTemplates.flatMap(u => {
            const unitTemplatePrice = u.prices.find(p => p.countryId === countryId);
            if (unitTemplatePrice) {
              return {
                unitTemplateId: u.unitTemplateId,
                unitLetter: u.unitLetter,
                price: unitTemplatePrice.price.toFixed(2),
                currencyId: unitTemplatePrice.currencyId.toString(),
              };
            }
            return {
              unitTemplateId: u.unitTemplateId,
              unitLetter: u.unitLetter,
              price: '',
              currencyId: '',
            };
          }),
        };
        dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload });
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

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ administratorId, courseId, countryId, dispatch, router, courseService, currencyService ]);
};
