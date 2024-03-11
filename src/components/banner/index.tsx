'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import DesktopImage20240306Event from './2024-03-06-event/desktop.jpg';
import MobileImage20240306Event from './2024-03-06-event/mobile.jpg';
import DesktopImage20240318Pet from './2024-03-18-pet/desktop.png';
import MobileImage20240318Pet from './2024-03-18-pet/mobile.png';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useAuthState } from '@/hooks/useAuthState';

export const Banner: FC = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { studentId } = useAuthState();

  useInitialData(dispatch, studentId);

  const [ hasEventCourses, hasPetCourses ] = useMemo(() => {
    let event = false;
    let pet = false;

    if (state.data) {
      for (const e of state.data.enrollments) {
        if (e.course.school.slug === 'event') {
          event = true;
        }
        if (e.course.school.slug === 'pet') {
          pet = true;
        }
      }
    }

    return [ event, pet ];
  }, [ state.data ]);

  if (typeof studentId === 'undefined' || !state.data || !hasEventCourses) {
    return null;
  }

  const now = new Date().getTime();

  if (hasPetCourses && now >= Date.UTC(2024, 2, 8, 20) && now < Date.UTC(2024, 2, 18, 4)) { // March 8 at 15:00 (20:00 GMT) to March 18 at 00:00 (4:00 GMT)
    return <Inner backgroundColor="#02013f" desktopSrc={DesktopImage20240318Pet.src} mobileSrc={MobileImage20240318Pet.src} url="https://event.webinarjam.com/register/7/6yr6wtx" />;
  }

  if (hasEventCourses && now >= Date.UTC(2024, 2, 5, 5) && now < Date.UTC(2024, 2, 27, 11)) { // March 5 at 00:00 (05:00 GMT) to March 27 at 07:00 (12:00 GMT)
    return <Inner backgroundColor="#3e3c6e" desktopSrc={DesktopImage20240306Event.src} mobileSrc={MobileImage20240306Event.src} url="https://event.webinarjam.com/replay/2/p8904fmiqiriky" />;
  }

  return null;
};

type Props = {
  backgroundColor: CSSProperties['backgroundColor'];
  desktopSrc: string;
  mobileSrc: string;
  url: string;
};

const Inner: FC<Props> = props => (
  <div style={{ backgroundColor: props.backgroundColor, textAlign: 'center', position: 'relative', flexGrow: 0 }}>
    <div className="container p-0">
      <a href={props.url} target="_blank" rel="noreferrer">
        <div className="d-none d-sm-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={props.desktopSrc} alt="" className="img-fluid" style={{ width: '100%' }} />
        </div>
        <div className="d-sm-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={props.mobileSrc} alt="" className="img-fluid" style={{ width: '100%' }} />
        </div>
      </a>
    </div>
  </div>
);
