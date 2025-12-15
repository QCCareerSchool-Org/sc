import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, iif, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useServices } from '@/hooks/useServices';

type EmailAddressChangeEvent = {
  countryCode: string;
  crmProvinces: State['crmProvinces'];
};

export const useCountryCodeChange = (dispatch: Dispatch<Action>): Subject<EmailAddressChangeEvent> => {
  const { crmProvinceService } = useServices();
  const navigateToLogin = useNavigateToLogin();

  const change$ = useRef(new Subject<EmailAddressChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    change$.current.pipe(
      switchMap(({ countryCode, crmProvinces }) => { // if a new request comes in abandon the current request
        return iif(
          () => typeof crmProvinces[countryCode] === 'undefined' && [ 'CA', 'US', 'AU' ].includes(countryCode),
          crmProvinceService.getAllCRMProvincesByCountryCode(countryCode), // fetch new provinces
          of(crmProvinces[countryCode] ?? []), // return the existing value
        ).pipe(
          tap({
            next: p => dispatch({ type: 'COUNTRY_CODE_UPDATED', payload: { countryCode, crmProvinces: p } }),
            // error: err => {
            //   let message = 'Update failed';
            //   if (err instanceof HttpServiceError) {
            //     if (err.login) {
            //       return void navigateToLogin();
            //     }
            //     if (err.message) {
            //       message = err.message;
            //     }
            //   }
            //   dispatch({ type: 'UPDATE_BILLING_ADDRESS_FAILED', payload: message });
            // },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmProvinceService, navigateToLogin ]);

  return change$.current;
};
