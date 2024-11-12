'use client';

import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import DesignDesktopImage from './2024/11/design/desktop-register.jpg';
import DesignMobileImage from './2024/11/design/mobile-register.jpg';
import EventDesktopImage from './2024/11/event/desktop-register.jpg';
import EventMobileImage from './2024/11/event/mobile-register.jpg';
import MakeupDesktopImage from './2024/11/makeup/desktop-register.jpg';
import MakeupMobileImage from './2024/11/makeup/mobile-register.jpg';
import PetDesktopImage from './2024/11/pet/desktop-register.jpg';
import PetMobileImage from './2024/11/pet/mobile-register.jpg';

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

  if (hasPetCourses && now < Date.UTC(2024, 10, 18, 23, 30)) { // 2024-11-18T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={PetDesktopImage.src} mobileSrc={PetMobileImage.src} url="https://event.webinarjam.com/register/62/5yw6ktn4" />;
  }

  if (hasEventCourses && now < Date.UTC(2024, 10, 20, 23, 30)) { // 2024-11-20T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={EventDesktopImage.src} mobileSrc={EventMobileImage.src} url="https://event.webinarjam.com/register/63/z2m64u73" />;
  }

  if (hasMakeupCourses && now < Date.UTC(2024, 10, 14, 23, 30)) { // 2024-11-14T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={MakeupDesktopImage.src} mobileSrc={MakeupMobileImage.src} url="https://event.webinarjam.com/register/61/n0g3zt5v" />;
  }

  if (hasDesignCourses && now < Date.UTC(2024, 10, 14, 23, 30)) { // 2024-11-14T18:30 (23:30 UTC)
    return <Inner backgroundColor="#02013f" desktopSrc={DesignDesktopImage.src} mobileSrc={DesignMobileImage.src} url="https://event.webinarjam.com/register/64/g4lzns69" />;
  }

  return null;
};
