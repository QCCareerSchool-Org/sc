'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import DesktopImage20240306Event from './2024-03-06-event/desktop.jpg';
import MobileImage20240306Event from './2024-03-06-event/mobile.jpg';
import Pet202404100Image from './2024-04-10-pet/register.png';
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

  if (typeof studentId === 'undefined' || !state.data) {
    return null;
  }

  const now = new Date().getTime();

  if (hasPetCourses && now >= Date.UTC(2024, 3, 9, 4) && now < Date.UTC(2024, 3, 10, 13)) { // April 9 at 99:00 (04:00 GMT) to April 10 at 09:00 (13:00 GMT)
    return (
      <div style={{ backgroundColor: '#02013f', textAlign: 'center', position: 'relative', flexGrow: 0 }}>
        <div className="container p-0">
          <a href="https://event.webinarjam.com/register/18/2yq68t9" target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={Pet202404100Image.src} alt="" className="img-fluid" style={{ maxWidth: 540, width: '100%' }} />
          </a>
        </div>
      </div>
    );
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
