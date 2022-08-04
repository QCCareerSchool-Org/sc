import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import { HttpServiceError } from '@/services/httpService';

export type PartDeletePayload = {
  administratorId: number;
  partId: string;
  processingState: State['form']['processingState'];
};

export const usePartDelete = (dispatch: Dispatch<Action>): Subject<PartDeletePayload> => {
  const { newPartTemplateService } = useAdminServices();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();

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
                  return void navigateToLogin();
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
  }, [ dispatch, newPartTemplateService, navigateToLogin, router ]);

  return partDelete$.current;
};
