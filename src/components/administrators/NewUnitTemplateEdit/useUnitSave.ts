import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { NewUnitTemplateSavePayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewUnitTemplateSaveEvent = {
  administratorId: number;
  unitId: string;
  payload: NewUnitTemplateSavePayload;
  processingState: State['form']['processingState'];
};

export const useUnitSave = (dispatch: Dispatch<Action>): Subject<NewUnitTemplateSaveEvent> => {
  const { newUnitTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();

  const unitSave$ = useRef(new Subject<NewUnitTemplateSaveEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    unitSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, unitId, payload }) => newUnitTemplateService.saveUnit(administratorId, unitId, payload).pipe(
        tap({
          next: updatedAssignment => {
            dispatch({ type: 'SAVE_UNIT_TEMPLATE_SUCCEEDED', payload: updatedAssignment });
          },
          error: err => {
            let message = 'Save failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin();
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
  }, [ dispatch, newUnitTemplateService, navigateToLogin ]);

  return unitSave$.current;
};
