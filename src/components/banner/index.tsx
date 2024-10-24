'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import PetDesktopImage from './2024-10-21-pet/desktop-register.png';
import PetMobileImage from './2024-10-21-pet/mobile-register.png';
import MakeupDesktopImage from './2024-10-22-makeup/desktop-register.jpg';
import MakeupMobileImage from './2024-10-22-makeup/mobile-register.jpg';
import EventDesktopImage from './2024-10-23-event/desktop-register.jpg';
import EventMobileImage from './2024-10-23-event/mobile-register.jpg';
import DesignDesktopImage from './2024-10-24-design/desktop-register.png';
import DesignMobileImage from './2024-10-24-design/mobile-register.jpg';

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

  if (hasPetCourses && now < Date.UTC(2024, 9, 21, 22, 30)) { // 2024-10-21T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={PetDesktopImage.src} mobileSrc={PetMobileImage.src} url="https://qccareerschool-2.wistia.com/live/events/seeij48wmm" />;
  }

  if (hasEventCourses && now < Date.UTC(2024, 9, 23, 22, 30)) { // 2024-10-23T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={EventDesktopImage.src} mobileSrc={EventMobileImage.src} url="https://event.webinarjam.com/register/59/4yk21tg6" />;
  }

  if (hasMakeupCourses && now < Date.UTC(2024, 9, 22, 22, 30)) { // 2024-10-22T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={MakeupDesktopImage.src} mobileSrc={MakeupMobileImage.src} url="https://qccareerschool-2.wistia.com/live/events/rqauy0orfe" />;
  }

  if (hasDesignCourses && now < Date.UTC(2024, 9, 24, 22, 30)) { // 2024-10-24T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={DesignDesktopImage.src} mobileSrc={DesignMobileImage.src} url="https://event.webinarjam.com/register/58/7yp6rtmr" />;
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
