/**
 * When the user clicks to view the lesson, we open it in a new tab. This is
 * required because we need to keep a SCORM object running on this parent page.
 * The child window will expect a particularly named global variable
 * `window.API_1484_11` in this page to be present. This object will make
 * various API requests to our back end.
 *
 * We periodically refresh the token on this page because actions taken in the
 * child window won't refresh the token themselves. Those actions are beyond our
 * control.
 *
 * On mobile devices in particular, when the screen is closed the refresh timer
 * won't run. So we keep track of the time of each refresh and, when the user
 * unlocks the screen again, if it has been too long since the last refresh,
 * we'll close the child window.
 */

import type { FC, ReactEventHandler } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { Subject, takeUntil } from 'rxjs';
import { initialState, reducer } from '../state';
import { useInitialData } from '../useInitialData';
import { useMaterialDataUpdate } from '../useMaterialDataUpdate';
import { useRefresh } from '../useRefresh';
import { useAuthState } from '@/hooks/useAuthState';
import { useLessonDispatch } from '@/hooks/useLessonDispatch';
import { useLessonState } from '@/hooks/useLessonState';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';
import { ScormAPI } from 'src/lib/scorm';

type Props = {
  studentId: number;
  courseId: number;
  materialId: string;
};

const REFRESH_INTERVAL_MS = 300_000; // 5 minutes
const MAX_UNREFRESHED_MS = 900_000; // 15 minutes

const getTime = (): number => new Date().getTime();

export const MaterialView: FC<Props> = ({ studentId, courseId, materialId }) => {
  const authState = useAuthState();
  const lessonState = useLessonState();
  const lessonDispatch = useLessonDispatch();
  const { loginService } = useServices();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, courseId, materialId);
  const refresh$ = useRefresh(dispatch, studentId, courseId, materialId);
  const materialDataUpdate$ = useMaterialDataUpdate();

  const scormAPI = useRef<ScormAPI>();

  const commit = useRef((data: Record<string, string>): boolean => {
    if (typeof authState.administratorId === 'undefined') { // don't save if logged in as an admin
      materialDataUpdate$.next({ studentId, materialId, data });
    }
    return true;
  });

  // refresh the access token periodically
  useEffect(() => {
    const destroy$ = new Subject<void>();

    let lastRefreshTime: number | null = null;

    /**
     * Refreshes the access token and records the time of the refresh.
     * Closes the child window if the refresh fails
     */
    const refreshAccessToken = (): void => {
      loginService.refresh().pipe(
        takeUntil(destroy$),
      ).subscribe({
        next: () => { lastRefreshTime = getTime(); },
        error: () => { console.error('couldn\'t refresh token'); },
      });
    };

    const listener = (): void => {
      const currentTime = getTime();
      if (lastRefreshTime !== null && lastRefreshTime < currentTime - MAX_UNREFRESHED_MS) {
        lessonState.currentLesson?.window.close();
      }
      if (lastRefreshTime === null || lastRefreshTime < currentTime - REFRESH_INTERVAL_MS) {
        refreshAccessToken();
      }
    };

    // refresh periodically
    const refreshIntervalId = setInterval(listener, 300);

    // refresh right away too
    refreshAccessToken();

    return () => {
      clearInterval(refreshIntervalId);
      destroy$.next();
      destroy$.complete();
    };
  }, [ lessonState.currentLesson, loginService ]);

  // create the SCORM 2004 API
  useEffect(() => {
    if (scormAPI.current) {
      return;
    }

    if (!state.data) {
      return;
    }

    scormAPI.current = new ScormAPI(state.data.material.materialId, commit.current, state.data.material.materialData);
    window.API_1484_11 = scormAPI.current;
  }, [ state.data ]);

  if (!state.data) {
    return null;
  }

  const href = `${endpoint}/students/${studentId}/static/lessons/${state.data.material.materialId}${state.data.material.entryPoint}`;

  const handleIframeLoad: ReactEventHandler<HTMLIFrameElement> = e => {
    if (!iframeRef.current) {
      return;
    }

    const iframe = iframeRef.current;

    if (!iframe.contentWindow) {
      return;
    }

    const contentWindow = iframe.contentWindow;

    const handleResize = (): void => {
      iframe.style.height = `${contentWindow.document.documentElement.scrollHeight}px`;
    };

    handleResize();

    contentWindow.addEventListener('resize', handleResize);
  };

  return <iframe ref={iframeRef} src={href} onLoad={handleIframeLoad} width="100%" />;
};
