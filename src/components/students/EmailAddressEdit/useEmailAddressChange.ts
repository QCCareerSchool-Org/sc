import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, forkJoin, of, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

type EmailAddressChangeEvent = {
  studentId: number;
  crmId?: number;
  emailAddress: string;
  processingState: State['form']['processingState'];
};

export const useEmailAddressChange = (dispatch: Dispatch<Action>): Subject<EmailAddressChangeEvent> => {
  const { studentService, crmStudentService } = useStudentServices();
  const router = useRouter();

  const change$ = useRef(new Subject<EmailAddressChangeEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    change$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving'),
      tap(() => dispatch({ type: 'UPDATE_EMAIL_ADDRESS_STARTED' })),
      exhaustMap(({ studentId, crmId, emailAddress }) => {
        return forkJoin([
          studentService.updateEmailAddress(studentId, emailAddress),
          typeof crmId === 'undefined' ? of(undefined) : crmStudentService.updateEmailAddress(crmId, emailAddress),
        ]).pipe(
          tap({
            next: ([ student, crmStudent ]) => dispatch({ type: 'UPDATE_EMAIL_ADDRESS_SUCEEDED', payload: { student, crmStudent } }),
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
              dispatch({ type: 'UPDATE_EMAIL_ADDRESS_FAILED', payload: message });
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
