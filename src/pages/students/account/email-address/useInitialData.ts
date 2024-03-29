import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { forkJoin, of, Subject, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number, crmId?: number): void => {
  const { studentService, crmStudentService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    forkJoin([
      studentService.getStudent(studentId),
      typeof crmId === 'undefined' ? of(undefined) : crmStudentService.getCRMStudent(crmId),
    ]).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: ([ student, crmStudent ]) => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: { student, crmStudent } }),
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin();
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_DATA_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, studentId, crmId, studentService, crmStudentService, navigateToLogin ]);
};
