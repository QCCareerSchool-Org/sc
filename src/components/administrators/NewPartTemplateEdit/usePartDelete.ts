import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { HttpServiceError } from '@/services/httpService';

export type PartDeletePayload = {
  administratorId: number;
  partId: string;
  processingState: State['form']['processingState'];
};

export const usePartDelete = (dispatch: Dispatch<Action>): Subject<PartDeletePayload> => {
  const router = useRouter();
  const { newPartTemplateService } = useAdminServices();

  const partDelete$ = useRef(new Subject<PartDeletePayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    partDelete$.current.pipe(
      filter(({ processingState }) => processingState !== 'saving' && processingState !== 'deleting'),
      tap(() => dispatch({ type: 'DELETE_PART_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, partId }) => {
        return newPartTemplateService.deletePart(administratorId, partId).pipe(
          tap({
            next: () => {
              dispatch({ type: 'DELETE_PART_TEMPLATE_SUCCEEDED' });
              router.back();
            },
            error: err => {
              let message = 'Delete failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'DELETE_PART_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newPartTemplateService ]);

  return partDelete$.current;
};
