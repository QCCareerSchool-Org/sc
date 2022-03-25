import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { newUnitTemplateService } from '@/services/administrators';
import type { NewUnitTemplatePayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export type UnitSavePayload = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  processingState: State['form']['processingState'];
  payload: NewUnitTemplatePayload;
};

export const useUnitSave = (dispatch: Dispatch<Action>): Subject<UnitSavePayload> => {
  const router = useRouter();

  const unitSave$ = useRef(new Subject<UnitSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, schoolId, courseId, unitId, payload }) => newUnitTemplateService.saveUnit(administratorId, schoolId, courseId, unitId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router ]);

  return unitSave$.current;
};
