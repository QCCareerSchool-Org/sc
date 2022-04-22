import { useRouter } from 'next/router';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useServices } from '@/hooks/useServices';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

export const useRefreshAndRetryMedia = (mediaRef: RefObject<HTMLAudioElement | HTMLVideoElement | HTMLImageElement>): Subject<void> => {
  const { loginService } = useServices();
  const authDispatch = useAuthDispatch();
  const router = useRouter();
  const refresh$ = useRef(new Subject<void>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    refresh$.current.pipe(
      switchMap(() => loginService.refresh().pipe(
        tap({
          next: authenticationPayload => {
            if (authenticationPayload.type === 'admin') {
              authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: { accountId: authenticationPayload.id, xsrfToken: authenticationPayload.xsrf } });
            } else if (authenticationPayload.type === 'tutor') {
              authDispatch({ type: 'TUTOR_LOG_IN', payload: { accountId: authenticationPayload.id, xsrfToken: authenticationPayload.xsrf } });
            } else if (authenticationPayload.type === 'student') {
              authDispatch({ type: 'STUDENT_LOG_IN', payload: { accountId: authenticationPayload.id, xsrfToken: authenticationPayload.xsrf } });
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
              return void navigateToLogin(router);
            }
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ authDispatch, loginService, router, mediaRef ]);

  return refresh$.current;
};
