import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export type PaymentMethodInsertEvent = {
  studentId: number;
  enrollmentIds: number[];
  singleUseToken: string;
  company: string;
  processingState: State['form']['processingState'];
};

export const usePaymentMethodInsert = (dispatch: Dispatch<Action>): Subject<PaymentMethodInsertEvent> => {
  const { crmPaymentMethodService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  const insert$ = useRef(new Subject<PaymentMethodInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    insert$.current.pipe(
      filter(({ processingState }) => processingState !== 'processing'),
      tap(() => dispatch({ type: 'ADD_PAYMENT_METHOD_STARTED' })),
      exhaustMap(({ studentId, enrollmentIds, company, singleUseToken }) => {
        return crmPaymentMethodService.addCRMPaymentMethod(studentId, enrollmentIds, company, singleUseToken).pipe(
          tap({
            next: paymentMethod => dispatch({ type: 'ADD_PAYMENT_METHOD_SUCEEDED', payload: paymentMethod }),
            error: err => {
              let message = 'Insert failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin();
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'ADD_PAYMENT_METHOD_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmPaymentMethodService, navigateToLogin ]);

  return insert$.current;
};
