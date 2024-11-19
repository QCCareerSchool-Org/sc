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

import { parse as parseInterval, toSeconds } from 'iso8601-duration';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { Subject, takeUntil, tap } from 'rxjs';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialDataUpdate } from './useMaterialDataUpdate';
import { useRefresh } from './useRefresh';
import { Img } from '@/components/Img';
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

type MaterialState = 'NOT_STARTED' | 'INCOMPLETE' | 'COMPLETE';

const REFRESH_INTERVAL_MS = 300_000; // 5 minutes
const MAX_UNREFRESHED_MS = 900_000; // 15 minutes

const WINDOW_NAME = 'qcLesson';

const getTime = (): number => new Date().getTime();

export const MaterialView: FC<Props> = ({ studentId, courseId, materialId }) => {
  const authState = useAuthState();
  const lessonState = useLessonState();
  const lessonDispatch = useLessonDispatch();
  const { loginService } = useServices();

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
        tap(() => console.log('refreshing')),
        takeUntil(destroy$),
      ).subscribe({
        next: () => { console.log(`successfully refreshed access token. Time set to ${new Date(getTime()).toISOString()}`); lastRefreshTime = getTime(); },
        error: () => { console.log('failed to refresh access token'); lessonState.currentLesson?.window.close(); },
      });
    };

    const listener = (): void => {
      const currentTime = getTime();
      console.log(`current time is ${new Date(currentTime).toISOString()}. Last refresh was ${lastRefreshTime === null ? 'null' : new Date(lastRefreshTime).toISOString()}.`);
      if (lastRefreshTime !== null && lastRefreshTime < currentTime - MAX_UNREFRESHED_MS) {
        console.log('failed to refresh in time');
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

  useEffect(() => {
    const currentLesson = lessonState.currentLesson;

    if (!currentLesson) {
      return;
    }

    // refresh the state and set childWindow to null if the child window closes
    const refreshIntervalId = setInterval(() => {
      if (currentLesson.window.closed) {
        refresh$.next();
        lessonDispatch({ type: 'CLEAR_LESSON' });
      }
    }, 300);

    // close the child window if this window closes or its location changes
    const listener = (): void => {
      currentLesson.window.close();
    };
    window.addEventListener('beforeunload', listener);
    window.addEventListener('popstate', listener);

    return () => {
      window.removeEventListener('popstate', listener);
      window.removeEventListener('beforeunload', listener);
      clearInterval(refreshIntervalId);
    };
  }, [ refresh$, lessonDispatch, lessonState.currentLesson ]);

  if (!state.data) {
    return null;
  }

  let totalTime: number | undefined = undefined;
  if (typeof state.data.material.materialData['cmi.total_time'] === 'string') {
    try {
      totalTime = toSeconds(parseInterval(state.data.material.materialData['cmi.total_time']));
    } catch { /* */ }
  }

  const href = `${endpoint}/students/${studentId}/static/lessons/${state.data.material.materialId}${state.data.material.entryPoint}`;
  const imageSrc = `${endpoint}/students/${studentId}/materials/${state.data.material.materialId}/image`;

  const handleClick: MouseEventHandler = () => {
    if (lessonState.currentLesson) {
      lessonState.currentLesson.window.close();
    }

    // const features = 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no';
    const w = window.open(href, WINDOW_NAME);
    if (w) {
      lessonDispatch({ type: 'SET_LESSON', payload: { window: w, materialId } });
    }
  };

  const materialState: MaterialState = Object.keys(state.data.material.materialData).length === 0 ? 'NOT_STARTED' : state.data.material.complete ? 'COMPLETE' : 'INCOMPLETE';

  return (
    <section>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-8 col-sm-4 mb-4 mb-sm-0">
            <Img src={imageSrc} alt={state.data.material.title} className="w-100 img-fluid" />
          </div>
          <div className="col-12 col-sm-8">
            <h1>{state.data.material.title}</h1>
            {state.data.material.description && <p>{state.data.material.description}</p>}
            {typeof totalTime !== 'undefined' && <p className="mb-0"><strong>Time in Lesson:</strong> <Duration seconds={totalTime} /></p>}
            <p className="mb-0"><strong>Status:</strong> {materialState === 'NOT_STARTED' ? 'Not Started' : materialState === 'COMPLETE' ? 'Complete' : 'Incomplete'}</p>
            {typeof state.data.material.materialData['cmi.score.scaled'] !== 'undefined' && (
              <p className="mb-0"><strong>Score:</strong> {Math.round(parseFloat(state.data.material.materialData['cmi.score.scaled']) * 100)}%</p>
            )}

            <div className="alert alert-info mt-4">
              Your lesson will open in a new tab. To ensure that your work is saved, please avoid closing this tab.
            </div>

            <button onClick={handleClick} className="btn btn-primary mt-3">{materialState === 'NOT_STARTED' ? 'Start Lesson' : materialState === 'COMPLETE' ? 'View Lesson' : 'Resume Lesson'}</button>

            {state.data.enrollment.dueDate && state.data.enrollment.dueDate <= new Date() && (
              <div className="alert alert-danger mt-4">
                <p>Your course due date has passed. Please contact the School to extend your course and pay your extension fee.</p>
                <p className="mb-0">You will be unable to submit assignments or complete lessons until your course has been extended.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

type DurationProps = {
  seconds: number;
};

const Duration: FC<DurationProps> = ({ seconds }) => {
  const dayInSeconds = 60 * 60 * 24;
  const hourInSeconds = 60 * 60;
  const minuteInSeconds = 60;

  let remainingSeconds = seconds;

  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (remainingSeconds >= dayInSeconds) {
    days = Math.floor(remainingSeconds / dayInSeconds);
    remainingSeconds -= days * dayInSeconds;
  }

  if (remainingSeconds >= hourInSeconds) {
    hours = Math.floor(remainingSeconds / hourInSeconds);
    remainingSeconds -= hours * hourInSeconds;
  }

  if (remainingSeconds >= minuteInSeconds) {
    minutes = Math.floor(remainingSeconds / minuteInSeconds);
    remainingSeconds -= minutes * minuteInSeconds;
  }

  if (days) {
    return <>{days} day{days !== 1 && 's'}, {hours} hour{hours !== 1 && 's'}</>;
  }

  if (hours) {
    return <>{hours} hour{hours !== 1 && 's'}, {minutes} minute{minutes !== 1 && 's'}</>;
  }

  if (minutes) {
    return <>{minutes} minute{minutes !== 1 && 's'}</>;
  }

  return <>Less than a minute</>;
};
