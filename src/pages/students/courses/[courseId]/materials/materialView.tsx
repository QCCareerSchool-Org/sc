import { parse as parseInterval, toSeconds } from 'iso8601-duration';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Subject, takeUntil } from 'rxjs';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialDataUpdate } from './useMaterialDataUpdate';
import { useRefresh } from './useRefresh';
import { Img } from '@/components/Img';
import { useAuthState } from '@/hooks/useAuthState';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';
import { ScormAPI } from 'src/lib/scorm';

type Props = {
  studentId: number;
  courseId: number;
  materialId: string;
};

type MaterialState = 'NOT_STARTED' | 'INCOMPLETE' | 'COMPLETE';

export const MaterialView: FC<Props> = ({ studentId, courseId, materialId }) => {
  const authState = useAuthState();
  const { loginService } = useServices();

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, courseId, materialId);
  const refresh$ = useRefresh(dispatch, studentId, courseId, materialId);
  const materialDataUpdate$ = useMaterialDataUpdate();

  const scormAPI = useRef<ScormAPI>();

  const [ childWindow, setChildWindow ] = useState<Window | null>(null);

  const commit = useRef((data: Record<string, string>): boolean => {
    if (typeof authState.administratorId === 'undefined') { // don't save if logged in as an admin
      materialDataUpdate$.next({ studentId, materialId, data });
    }
    return true;
  });

  // refresh the access token periodically
  useEffect(() => {
    const delay = 1000 * 60 * 29; // 29 minutes
    const destroy$ = new Subject<void>();
    const intervalId = setInterval(() => {
      loginService.refresh().pipe(
        takeUntil(destroy$),
      ).subscribe();
    }, delay);

    return () => {
      clearInterval(intervalId);
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

  useEffect(() => {
    if (!childWindow) {
      return;
    }
    const listener = (): void => {
      childWindow.close();
    };
    window.addEventListener('beforeunload', listener);

    const intervalId = setInterval(() => {
      if (childWindow.closed) {
        refresh$.next();
        setChildWindow(null);
      }
    }, 300);

    return () => {
      window.removeEventListener('beforeunload', listener);
      clearInterval(intervalId);
    };
  }, [ refresh$, childWindow ]);

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
    setChildWindow(window.open(href, materialId ?? '_blank'));
  };

  const materialState: MaterialState = Object.keys(state.data.material.materialData).length === 0 ? 'NOT_STARTED' : state.data.material.materialData['cmi.completion_status'] === 'completed' ? 'COMPLETE' : 'INCOMPLETE';

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
