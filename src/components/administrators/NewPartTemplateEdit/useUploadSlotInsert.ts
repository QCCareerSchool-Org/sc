import { useRouter } from 'next/router';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { navigateToLogin } from '../../../navigateToLogin';
import type { Action, State } from './state';
import { useAdminServices } from '@/hooks/useAdminServices';
import type { NewUploadSlotTemplateAddPayload } from '@/services/administrators/newUploadSlotTemplateService';
import { HttpServiceError } from '@/services/httpService';

export type NewUploadSlotTemplateInsertEvent = {
  administratorId: number;
  payload: NewUploadSlotTemplateAddPayload;
  processingState: State['newUoloadSlotTemplateForm']['processingState'];
};

export const useUploadSlotInsert = (dispatch: Dispatch<Action>): Subject<NewUploadSlotTemplateInsertEvent> => {
  const router = useRouter();
  const { newUploadSlotTemplateService } = useAdminServices();

  const uploadSlotInsert$ = useRef(new Subject<NewUploadSlotTemplateInsertEvent>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    uploadSlotInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_STARTED' })),
      exhaustMap(({ administratorId, payload }) => {
        return newUploadSlotTemplateService.addUploadSlot(administratorId, payload).pipe(
          tap({
            next: insertedTextBox => {
              dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_SUCCEEDED', payload: insertedTextBox });
            },
            error: err => {
              let message = 'Insert failed';
              if (err instanceof HttpServiceError) {
                if (err.login) {
                  return void navigateToLogin(router);
                }
                if (err.message) {
                  message = err.message;
                }
              }
              dispatch({ type: 'ADD_UPLOAD_SLOT_TEMPLATE_FAILED', payload: message });
            },
          }),
          catchError(() => EMPTY),
        );
      }),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ dispatch, router, newUploadSlotTemplateService ]);

  return uploadSlotInsert$.current;
};
