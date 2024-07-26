'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import Event20240717DesktopImage from './2024-07-17-event/replay-desktop.png';
import Event20240717MobileImage from './2024-07-17-event/replay-mobile.png';
import Pet20240723DesktopImage from './2024-07-23-pet/replay-desktop.png';
import Pet20240723MobileImage from './2024-07-23-pet/replay-mobile.png';
import Makeup20240724DesktopImage from './2024-07-24-makeup/replay-desktop.png';
import Makeup20240724MobileImage from './2024-07-24-makeup/replay-mobile.png';
import Design20240725DesktopImage from './2024-07-25-design/replay-desktop.png';
import Design20240725MobileImage from './2024-07-25-design/replay-mobile.png';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useAuthState } from '@/hooks/useAuthState';

export const Banner: FC = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { studentId } = useAuthState();

  useInitialData(dispatch, studentId);

  const [ hasEventCourses, hasPetCourses, hasMakeupCourses, hasDesignCourses ] = useMemo(() => {
    let event = false;
    let pet = false;
    let design = false;
    let makeup = false;

    if (state.data) {
      for (const e of state.data.enrollments) {
        if (e.course.school.slug === 'event') {
          event = true;
        }
        if (e.course.school.slug === 'pet') {
          pet = true;
        }
        if (e.course.school.slug === 'design') {
          design = true;
        }
        if (e.course.school.slug === 'makeup') {
          makeup = true;
        }
      }
    }

    return [ event, pet, makeup, design ];
  }, [ state.data ]);

  if (typeof studentId === 'undefined' || !state.data) {
    return null;
  }

  const now = new Date().getTime();

  if (hasPetCourses) {
    return <Inner backgroundColor="#02013f" desktopSrc={Pet20240723DesktopImage.src} mobileSrc={Pet20240723MobileImage.src} url="https://event.webinarjam.com/go/replay/38/r1o8vcv6iwvb0gcl" />;
  }

  if (hasEventCourses) {
    return <Inner backgroundColor="#02013f" desktopSrc={Event20240717DesktopImage.src} mobileSrc={Event20240717MobileImage.src} url="https://event.webinarjam.com/go/replay/37/1y86otpgt89awou4" />;
  }

  if (hasMakeupCourses) {
    return <Inner backgroundColor="#02013f" desktopSrc={Makeup20240724DesktopImage.src} mobileSrc={Makeup20240724MobileImage.src} url="https://event.webinarjam.com/go/replay/39/6yr6wt54f36s9ra6" />;
  }

  if (hasDesignCourses) {
    return <Inner backgroundColor="#02013f" desktopSrc={Design20240725DesktopImage.src} mobileSrc={Design20240725MobileImage.src} url="https://event.webinarjam.com/go/replay/40/7yp6rt7wh4rtz1bw" />;
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
