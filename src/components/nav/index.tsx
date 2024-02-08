import dynamic from 'next/dynamic';
import type { FC } from 'react';

import type { AdministratorNavProps } from './AdministratorNav';
import type { AuditorNavProps } from './AuditorNav';
import type { StudentNavProps } from './StudentNav';
import type { TutorNavProps } from './TutorNav';
import { useAuthState } from '@/hooks/useAuthState';

const AdministratorNav = dynamic<AdministratorNavProps>(async () => import('./AdministratorNav').then(mod => mod.AdministratorNav));
const StudentNav = dynamic<StudentNavProps>(async () => import('./StudentNav').then(mod => mod.StudentNav));
const TutorNav = dynamic<TutorNavProps>(async () => import('./TutorNav').then(mod => mod.TutorNav));
const AuditorNav = dynamic<AuditorNavProps>(async () => import('./AuditorNav').then(mod => mod.AuditorNav));

export const SiteNav: FC = () => {
  const authState = useAuthState();
  return (
    <>
      {typeof authState.studentId !== 'undefined' && <StudentNav />}
      {typeof authState.tutorId !== 'undefined' && <TutorNav />}
      {typeof authState.auditorId !== 'undefined' && <AuditorNav />}
      {typeof authState.administratorId !== 'undefined' && <AdministratorNav />}
    </>
  );
};
