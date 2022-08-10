import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { useNavigateToLogin } from './useNavigateToLogin';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';

export const useRefreshAndRetryMedia = (mediaRef: RefObject<HTMLAudioElement | HTMLVideoElement | HTMLImageElement>): Subject<void> => {
  const { loginService } = useServices();
  const authDispatch = useAuthDispatch();
  const navigateToLogin = useNavigateToLogin();
  const refresh$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    refresh$.current.pipe(
      switchMap(() => loginService.refresh().pipe(
        tap({
          next: authenticationPayload => {
            if (authenticationPayload.studentCenter.type === 'admin') {
              authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: { accountId: authenticationPayload.studentCenter.id, xsrfToken: authenticationPayload.xsrf } });
            } else if (authenticationPayload.studentCenter.type === 'tutor') {
              authDispatch({ type: 'TUTOR_LOG_IN', payload: { accountId: authenticationPayload.studentCenter.id, xsrfToken: authenticationPayload.xsrf } });
            } else if (authenticationPayload.studentCenter.type === 'student') {
              authDispatch({ type: 'STUDENT_LOG_IN', payload: { accountId: authenticationPayload.studentCenter.id, xsrfToken: authenticationPayload.xsrf, crmId: authenticationPayload.crm?.id } });
            }
            if (mediaRef.current) {
              // eslint-disable-next-line no-self-assign
              mediaRef.current.src = mediaRef.current.src;
              if ('load' in mediaRef.current) {
                mediaRef.current.load();
                void mediaRef.current?.play();
              }
            }
          },
          error: err => {
            if (err instanceof HttpServiceError && err.login) {
              return void navigateToLogin();
            }
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ authDispatch, loginService, navigateToLogin, mediaRef ]);

  return refresh$.current;
};
