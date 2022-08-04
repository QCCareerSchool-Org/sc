import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type BillingAddressChangeEvent = {
  crmId: number;
  address1: string;
  address2: string;
  city: string;
  provinceCode: string;
  postalCode: string;
  countryCode: string;
  processingState: State['form']['processingState'];
};

export const useBillingAddressChange = (dispatch: Dispatch<Action>): Subject<BillingAddressChangeEvent> => {
  const { studentService, crmStudentService } = useStudentServices();
  const router = useRouter();

  const change$ = useRef(new Subject<BillingAddressChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    change$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'UPDATE_BILLING_ADDRESS_STARTED' })),
      exhaustMap(({ crmId, address1, address2, city, provinceCode, postalCode, countryCode }) => {
        return crmStudentService.updateBillingAddress(crmId, address1, address2, city, provinceCode, postalCode, countryCode).pipe(
          tap({
            next: crmStudent => dispatch({ type: 'UPDATE_BILLING_ADDRESS_SUCEEDED', payload: crmStudent }),
            error: err => {
              let message = 'Update failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'UPDATE_BILLING_ADDRESS_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentService, crmStudentService, router ]);

  return change$.current;
};
