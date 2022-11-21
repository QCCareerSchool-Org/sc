import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewSubmissionTemplatePricePayload } from '@/services/administrators/newSubmissionTemplatePriceService';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitPricesSaveEvent = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
  payload: NewSubmissionTemplatePricePayload;
  processingState: State['form']['processingState'];
};

export const usePricesSave = (dispatch: Dispatch<Action>): Subject<NewUnitPricesSaveEvent> => {
  const { newSubmissionTemplatePriceService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const pricesSave$ = useRef(new Subject<NewUnitPricesSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    pricesSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'UNIT_PRICES_SAVE_STARTED' })),
      exhaustMap(({ administratorId, courseId, countryId, payload }) => newSubmissionTemplatePriceService.replacePrices(administratorId, courseId, countryId, payload).pipe(
        tap({
          next: () => {
            dispatch({ type: 'UNIT_PRICES_SAVE_SUCCEEDED' });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
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
  }, [ dispatch, newSubmissionTemplatePriceService, navigateToLogin ]);

  return pricesSave$.current;
};
