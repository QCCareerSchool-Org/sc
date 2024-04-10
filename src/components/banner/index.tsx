'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import Event20240410DesktopImage from './2024-04-10-event/register-desktop.png';
import Event20240410MobileImage from './2024-04-10-event/register-mobile.png';
import Pet20240410DesktopImage from './2024-04-10-pet/replay-desktop.png';
import Pet20240410MobileImage from './2024-04-10-pet/replay-mobile.png';

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

  if (hasPetCourses && now >= Date.UTC(2024, 3, 11, 4) && now < Date.UTC(2024, 3, 25, 13)) { // April 11 at 00:00 (04:00 GMT) to April 25 at 09:00 (13:00 GMT)
    return <Inner backgroundColor="#02013f" desktopSrc={Pet20240410DesktopImage.src} mobileSrc={Pet20240410MobileImage.src} url="https://event.webinarjam.com/go/replay/18/m9zpvhos3sgsg" />;
  }

  if (hasEventCourses && now >= Date.UTC(2024, 3, 9, 4) && now < Date.UTC(2024, 3, 11, 13)) { // April 9 at 00:00 (04:00 GMT) to April 11 at 09:00 (13:00 GMT)
    return <Inner backgroundColor="#02013f" desktopSrc={Event20240410DesktopImage.src} mobileSrc={Event20240410MobileImage.src} url="https://event.webinarjam.com/register/21/0yo60to" />;
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
