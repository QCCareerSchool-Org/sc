'use client';

import type { FC } from 'react';
import { useMemo, useReducer } from 'react';

import DesktopImage from './sc-banner-1320.jpg';
import MobileImage from './sc-banner-540.jpg';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useAuthState } from '@/hooks/useAuthState';

const startDate = Date.UTC(2024, 2, 5, 5); // March 5 at 00:00 (05:00 GMT)
const endDate = Date.UTC(2024, 2, 6, 12); // March 6 at 07:00 (12:00 GMT)

const backgroundColor = '#3e3c6e';

export const Banner: FC = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { studentId } = useAuthState();

  useInitialData(dispatch, studentId);

  const hasEventCourses = useMemo(() => state.data?.enrollments.some(e => e.course.school.slug === 'event'), [ state.data ]);

  if (typeof studentId === 'undefined' || !state.data || !hasEventCourses) {
    return null;
  }

  const now = new Date().getTime();

  if (now >= startDate && now < endDate) {
    return (
      <div style={{ backgroundColor, textAlign: 'center', position: 'relative', flexGrow: 0 }}>
        <div className="container p-0">
          <a href="https://event.webinarjam.com/register/2/kznpvbz">
            <div className="d-none d-sm-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DesktopImage.src} alt="" className="img-fluid" style={{ width: '100%' }} />
            </div>
            <div className="d-sm-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MobileImage.src} alt="" className="img-fluid" style={{ width: '100%' }} />
            </div>
          </a>
        </div>
      </div>
    );
  }

  return null;
};
