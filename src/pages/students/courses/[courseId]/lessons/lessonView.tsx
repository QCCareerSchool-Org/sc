import { parse as parseInterval, toSeconds } from 'iso8601-duration';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useReducer, useRef } from 'react';

import { Subject, takeUntil } from 'rxjs';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMaterialDataUpdate } from './useInitializeNextUnit';
import { Img } from '@/components/Img';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';
import { ScormAPI } from 'src/lib/scorm';

type Props = {
  studentId: number;
  materialId: string;
};

export const LessonView: FC<Props> = ({ studentId, materialId }) => {
  const { loginService } = useServices();

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, materialId);
  const materialDataUpdate$ = useMaterialDataUpdate();

  const scormAPI = useRef<ScormAPI>();

  const childWindow = useRef<Window | null>(null);

  const commit = useRef((data: Record<string, string>): boolean => {
    materialDataUpdate$.next({ studentId, materialId, data });
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

    if (!state.material) {
      return;
    }

    scormAPI.current = new ScormAPI(state.material.materialId, commit.current, state.material.materialData);
    window.API_1484_11 = scormAPI.current;
  }, [ state.material ]);

  useEffect(() => {
    const listener = (): void => {
      if (childWindow.current) {
        childWindow.current.close();
      }
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, []);

  if (!state.material) {
    return null;
  }

  let totalTime: number | undefined = undefined;
  if (typeof state.material.materialData['cmi.total_time'] === 'string') {
    try {
      totalTime = toSeconds(parseInterval(state.material.materialData['cmi.total_time']));
    } catch { /* */ }
  }

  const href = `${endpoint}/students/${studentId}/static/lessons/${state.material.materialId}${state.material.entryPoint}`;
  const imageSrc = `${endpoint}/students/${studentId}/materials/${state.material.materialId}/image`;

  const handleClick: MouseEventHandler = () => {
    childWindow.current = window.open(href, materialId ?? '_blank');
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6">
            <Img src={imageSrc} alt={state.material.title} className="img-fluid" />
          </div>
          <div className="col-12 col-sm-6">
            <h1>{state.material.title}</h1>
            {state.material.description && <p>{state.material.description}</p>}
            {typeof totalTime !== 'undefined' && <p>Time in Lesson: <Duration seconds={totalTime} /></p>}

            <button onClick={handleClick} className="btn btn-primary">Open Lesson</button>

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
    return <>{days} days, {hours} hours</>;
  }

  if (hours) {
    return <>{hours} hours, {minutes} minutes</>;
  }

  if (minutes) {
    return <>{minutes} minutes</>;
  }

  return <>Under a minute</>;
};
