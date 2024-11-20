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

import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { Subject, takeUntil } from 'rxjs';
import { initialState, reducer } from '../state';
import { useInitialData } from '../useInitialData';
import { useMaterialDataUpdate } from '../useMaterialDataUpdate';
import { useAuthState } from '@/hooks/useAuthState';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';
import { ScormAPI } from 'src/lib/scorm';

type Props = {
  studentId: number;
  courseId: number;
  materialId: string;
};

const REFRESH_INTERVAL_MS = 300_000; // 5 minutes

const getTime = (): number => new Date().getTime();

export const MaterialView: FC<Props> = ({ studentId, courseId, materialId }) => {
  const authState = useAuthState();
  const { loginService } = useServices();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [ state, dispatch ] = useReducer(reducer, initialState);

  const commitFailure$ = useRef(new Subject<void>());

  useInitialData(dispatch, studentId, courseId, materialId);
  const materialDataUpdate$ = useMaterialDataUpdate(commitFailure$.current);

  const scormAPI = useRef<ScormAPI>();

  const commit = useRef((data: Record<string, string>): boolean => {
    if (typeof authState.administratorId === 'undefined') { // don't save if logged in as an admin
      materialDataUpdate$.next({ studentId, materialId, data });
    }
    return true;
  });

  // refresh the access token periodically and when the tab become visible
  useEffect(() => {
    const destroy$ = new Subject<void>();

    let lastRefreshTime: number | null = null;

    /**
     * Refreshes the access token and records the time of the refresh.
     */
    const refresh = (): void => {
      loginService.refresh().pipe(
        takeUntil(destroy$),
      ).subscribe({
        next: () => { lastRefreshTime = getTime(); },
        error: () => { loginService.logOut(); },
      });
    };

    const refreshIfTimeElapsed = (): void => {
      const currentTime = getTime();
      if (lastRefreshTime === null || lastRefreshTime < currentTime - REFRESH_INTERVAL_MS) {
        refresh();
      }
    };

    const listener = (): void => {
      if (window.document.visibilityState === 'visible') {
        refresh();
      }
    };

    // refresh periodically
    const refreshIntervalId = setInterval(refreshIfTimeElapsed, 300);
    window.addEventListener('visibilitychange', listener);

    // refresh right away too
    refresh();

    return () => {
      window.removeEventListener('visibilitychange', listener);
      clearInterval(refreshIntervalId);
      destroy$.next();
      destroy$.complete();
    };
  }, [ loginService ]);

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

  return (
    <>
      <div className="bg-dark text-light py-2 py-lg-3">
        <div className="container">
          <Link href={`/students/courses/${courseId}`} className="btn btn-outline-light">Back to Course</Link>
        </div>
      </div>
      <iframe ref={iframeRef} src={href} width="100%" style={{ display: 'flex', flexGrow: 1 }} />
    </>
  );

};
