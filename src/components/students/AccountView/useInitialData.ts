import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action } from './state';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, crmId?: number): void => {
  const { studentService, t2202ReceiptService, crmStudentService } = useStudentServices();
  const router = useRouter();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    forkJoin([
      studentService.getStudent(studentId),
      t2202ReceiptService.getT2202Receipts(studentId),
      typeof crmId === 'undefined' ? of(undefined) : crmStudentService.getCRMStudent(crmId),
    ]).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: ([ student, t2202Receipts, crmStudent ]) => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: { student, t2202Receipts, crmStudent } }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ studentId, crmId, dispatch, studentService, t2202ReceiptService, crmStudentService, router ]);
};
