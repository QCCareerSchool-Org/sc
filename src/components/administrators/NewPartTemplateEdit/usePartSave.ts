import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewPartTemplateSavePayload } from '@/services/administrators/newPartTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type PartSavePayload = {
  administratorId: number;
  partId: string;
  processingState: State['form']['processingState'];
  payload: NewPartTemplateSavePayload;
};

export const usePartSave = (dispatch: Dispatch<Action>): Subject<PartSavePayload> => {
  const router = useRouter();
  const { newPartTemplateService } = useAdminServices();

  const partSave$ = useRef(new Subject<PartSavePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    partSave$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'SAVE_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, partId, payload }) => {
        return newPartTemplateService.savePart(administratorId, partId, payload).pipe(
          tap({
            next: updatedPart => {
              dispatch({ type: 'SAVE_PART_TEMPLATE_SUCCEEDED', payload: updatedPart });
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
              dispatch({ type: 'SAVE_PART_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newPartTemplateService ]);

  return partSave$.current;
};
