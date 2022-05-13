import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewUnitTemplatePricePayload } from '@/services/administrators/newUnitTemplatePriceService';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitPricesSaveEvent = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
  payload: NewUnitTemplatePricePayload;
  processingState: State['form']['processingState'];
};

export const usePricesSave = (dispatch: Dispatch<Action>): Subject<NewUnitPricesSaveEvent> => {
  const router = useRouter();
  const { newUnitTemplatePriceService } = useAdminServices();

  const pricesSave$ = useRef(new Subject<NewUnitPricesSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    pricesSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'UNIT_PRICES_SAVE_STARTED' })),
      exhaustMap(({ administratorId, courseId, countryId, payload }) => newUnitTemplatePriceService.replacePrices(administratorId, courseId, countryId, payload).pipe(
        tap({
          next: () => {
            dispatch({ type: 'UNIT_PRICES_SAVE_SUCCEEDED' });
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
            dispatch({ type: 'UNIT_PRICES_SAVE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUnitTemplatePriceService ]);

  return pricesSave$.current;
};
