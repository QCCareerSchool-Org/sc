import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type TelephoneNumberChangeEvent = {
  crmId: number;
  telephoneCountryCode: number;
  telephoneNumber: string;
  processingState: State['form']['processingState'];
};

export const useTelephoneNumberChange = (dispatch: Dispatch<Action>): Subject<TelephoneNumberChangeEvent> => {
  const { crmStudentService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const change$ = useRef(new Subject<TelephoneNumberChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    change$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'UPDATE_TELEPHONE_NUMBER_STARTED' })),
      exhaustMap(({ crmId, telephoneCountryCode, telephoneNumber }) => {
        return crmStudentService.updateTelephoneNumber(crmId, telephoneCountryCode, telephoneNumber).pipe(
          tap({
            next: crmStudent => dispatch({ type: 'UPDATE_TELEPHONE_NUMBER_SUCEEDED', payload: crmStudent }),
            error: err => {
              let message = 'Update failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'UPDATE_TELEPHONE_NUMBER_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmStudentService, navigateToLogin ]);

  return change$.current;
};
