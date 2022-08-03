import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, of, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useServices } from '@/hooks/useServices';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type PaymentMethodChargeEvent = {
  studentId: number;
  enrollmentId: number;
  paymentMethodId: number;
  amount: number;
  processingState: State['form']['processingState'];
};

export const usePaymentMethodCharge = (dispatch: Dispatch<Action>): Subject<PaymentMethodChargeEvent> => {
  const { crmPaymentMethodService } = useStudentServices();
  const router = useRouter();

  const change$ = useRef(new Subject<PaymentMethodChargeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    change$.current.pipe(
      filter(({ processingState }) => processingState !== 'processing'),
      tap(() => dispatch({ type: 'CHARGE_PAYMENT_METHOD_STARTED' })),
      exhaustMap(({ studentId, enrollmentId, paymentMethodId, amount }) => {
        return crmPaymentMethodService.chargeCRMPaymentMethod(studentId, enrollmentId, paymentMethodId, amount).pipe(
          tap({
            next: transaction => {
              if (transaction.amount) {
                dispatch({ type: 'CHARGE_PAYMENT_METHOD_SUCEEDED', payload: transaction });
              } else {
                dispatch({ type: 'CHARGE_PAYMENT_METHOD_DECLINED', payload: transaction });
              }
            },
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
              dispatch({ type: 'CHARGE_PAYMENT_METHOD_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, crmPaymentMethodService, router ]);

  return change$.current;
};
