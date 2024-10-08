'use client';

import type { CSSProperties, FC } from 'react';
import { useMemo, useReducer } from 'react';

import EventDesktopImage from './2024-09-18-event/desktop-register.jpg';
import EventMobileImage from './2024-09-18-event/mobile-register.jpg';
import MakeupDesktopImage from './2024-09-24-makeup/desktop-register.jpg';
import MakeupMobileImage from './2024-09-24-makeup/mobile-register.jpg';
import PetDesktopImage from './2024-09-25-pet/desktop-register.jpg';
import PetMobileImage from './2024-09-25-pet/mobile-register.jpg';
import DesignDesktopImage from './2024-09-26-design/desktop-register.jpg';
import DesignMobileImage from './2024-09-26-design/mobile-register.jpg';

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

  if (hasPetCourses && now < Date.UTC(2024, 8, 25, 22, 30)) { // 2024-09-25T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={PetDesktopImage.src} mobileSrc={PetMobileImage.src} url="https://event.webinarjam.com/register/55/6yr6wt0x" />;
  }

  if (hasEventCourses && now < Date.UTC(2024, 8, 18, 22, 30)) { // 2024-09-18T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={EventDesktopImage.src} mobileSrc={EventMobileImage.src} url="https://event.webinarjam.com/register/52/r1o8vc8n" />;
  }

  if (hasMakeupCourses && now < Date.UTC(2024, 8, 24, 22, 30)) { // 2024-09-24T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={MakeupDesktopImage.src} mobileSrc={MakeupMobileImage.src} url="https://event.webinarjam.com/register/53/p8904fm5" />;
  }

  if (hasDesignCourses && now < Date.UTC(2024, 8, 26, 22, 30)) { // 2024-09-26T18:30 (22:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={DesignDesktopImage.src} mobileSrc={DesignMobileImage.src} url="https://event.webinarjam.com/register/54/m9zpvhzk" />;
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
