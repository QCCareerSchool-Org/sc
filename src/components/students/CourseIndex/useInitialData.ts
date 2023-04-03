import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { catchError, map, of, Subject, switchMap, takeUntil } from 'rxjs';

import type { Action } from './state';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { useStudentServices } from '@/hooks/useStudentServices';
import { HttpServiceError } from '@/services/httpService';

export const useInitialData = (dispatch: Dispatch<Action>, studentId: number): void => {
  const { studentService, crmStudentService } = useStudentServices();
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    const destroy$ = new Subject<void>();

    studentService.getStudent(studentId).pipe(
      switchMap(student => {
        if (student.apiUsername) {
          return crmStudentService.getCRMStudent(student.apiUsername).pipe(
            catchError(() => of(undefined)),
            map(crmStudent => ({ student, crmStudent })),
          );
        }
        return of({ student });
      }),
      takeUntil(destroy$),
    ).subscribe({
      next: student => dispatch({ type: 'LOAD_DATA_SUCCEEDED', payload: student }),
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
  }, [ dispatch, studentId, studentService, crmStudentService, navigateToLogin ]);
};
