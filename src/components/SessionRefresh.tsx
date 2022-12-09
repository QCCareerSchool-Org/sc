import type { FC } from 'react';
import { useEffect } from 'react';

import { useAuthState } from '@/hooks/useAuthState';

export const SessionRefresh: FC = () => {
  const { studentId, tutorId, administratorId } = useAuthState();

  useEffect(() => {
    const refreshUrl = '/students/refresh-session.php';
    if (typeof studentId !== 'undefined') {
      const intervalId = setInterval(() => {
        fetch(refreshUrl).catch(() => { /* empty */ });
      }, 1000 * 60 * 10);
      return () => clearInterval(intervalId);
    }
  }, [ studentId ]);

  useEffect(() => {
    const refreshUrl = '/tutors/refresh-session.php';
    if (typeof tutorId !== 'undefined') {
      const intervalId = setInterval(() => {
        fetch(refreshUrl).catch(() => { /* empty */ });
      }, 1000 * 60 * 10);
      return () => clearInterval(intervalId);
    }
  }, [ tutorId ]);

  useEffect(() => {
    const refreshUrl = '/administrators/refresh-session.php';
    if (typeof administratorId !== 'undefined') {
      const intervalId = setInterval(() => {
        fetch(refreshUrl).catch(() => { /* empty */ });
      }, 1000 * 60 * 10);
      return () => clearInterval(intervalId);
    }
  }, [ administratorId ]);

  return null;
};
