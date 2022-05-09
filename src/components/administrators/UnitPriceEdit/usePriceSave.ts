import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewUnitPricePayload } from '@/services/administrators/newUnitPriceService';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitPricesSaveEvent = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
  payload: NewUnitPricePayload;
  processingState: State['form']['processingState'];
};

export const usePriceSave = (dispatch: Dispatch<Action>): Subject<NewUnitPricesSaveEvent> => {
  const router = useRouter();
  const { newUnitPriceService } = useAdminServices();

  const unitSave$ = useRef(new Subject<NewUnitPricesSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'UNIT_PRICES_SAVE_STARTED' })),
      exhaustMap(({ administratorId, courseId, countryId, payload }) => newUnitPriceService.replacePrices(administratorId, courseId, countryId, payload).pipe(
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
  }, [ dispatch, router, newUnitPriceService ]);

  return unitSave$.current;
};
