import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitPricesDeleteEvent = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
  processingState: State['form']['processingState'];
};

export const usePricesDelete = (dispatch: Dispatch<Action>): Subject<NewUnitPricesDeleteEvent> => {
  const router = useRouter();
  const { newUnitTemplatePriceService } = useAdminServices();

  const pricesDelete$ = useRef(new Subject<NewUnitPricesDeleteEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    pricesDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'UNIT_PRICES_DELETE_STARTED' })),
      exhaustMap(({ administratorId, courseId, countryId }) => newUnitTemplatePriceService.deletePrices(administratorId, courseId, countryId).pipe(
        tap({
          next: () => {
            dispatch({ type: 'UNIT_PRICES_DELETE_SUCCEEDED' });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'UNIT_PRICES_DELETE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUnitTemplatePriceService ]);

  return pricesDelete$.current;
};
