'use client';

import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import DesignDesktopImage from './2025/01/design/desktop-register.jpg';
import DesignMobileImage from './2025/01/design/mobile-register.jpg';
import PetDesktopImage from './2025/01/pet/desktop-register.jpg';
import PetMobileImage from './2025/01/pet/mobile-register.jpg';
import EventDesktopImage from './2025/02/event/desktop-register.jpg';
import EventMobileImage from './2025/02/event/mobile-register.jpg';
import MakeupDesktopImage from './2025/02/makeup/desktop-register.jpg';
import MakeupMobileImage from './2025/02/makeup/mobile-register.jpg';

import { Inner } from './inner';
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
        } else if (e.course.school.slug === 'pet') {
          pet = true;
        } else if (e.course.school.slug === 'design') {
          design = true;
        } else if (e.course.school.slug === 'makeup') {
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

  if (hasPetCourses && now < Date.UTC(2025, 0, 23, 23, 30)) { // 2025-01-23T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={PetDesktopImage.src} mobileSrc={PetMobileImage.src} url="https://event.webinarjam.com/register/74/kznpvb9z" />;
  }

  if (hasEventCourses && now < Date.UTC(2025, 1, 19, 23, 30)) { // 2025-01-15T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={EventDesktopImage.src} mobileSrc={EventMobileImage.src} url="https://event.webinarjam.com/register/72/qq0o4b85" />;
  }

  if (hasMakeupCourses && now < Date.UTC(2025, 1, 18, 23, 30)) { // 2025-01-14T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={MakeupDesktopImage.src} mobileSrc={MakeupMobileImage.src} url="https://event.webinarjam.com/register/71/8ym3ptyo" />;
  }

  if (hasDesignCourses && now < Date.UTC(2025, 0, 14, 21, 30)) { // 2025-01-21T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={DesignDesktopImage.src} mobileSrc={DesignMobileImage.src} url="https://event.webinarjam.com/register/73/1y86ot3p" />;
  }

  return null;
};
