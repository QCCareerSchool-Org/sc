import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';

import type { AdministratorNavProps } from './AdministratorNav';
import type { StudentNavProps } from './StudentNav';
import type { TutorNavProps } from './TutorNav';
import { useAuthState } from '@/hooks/useAuthState';

const AdministratorNav = dynamic<AdministratorNavProps>(async () => import('./AdministratorNav').then(mod => mod.AdministratorNav));
const StudentNav = dynamic<StudentNavProps>(async () => import('./StudentNav').then(mod => mod.StudentNav));
const TutorNav = dynamic<TutorNavProps>(async () => import('./TutorNav').then(mod => mod.TutorNav));

export const SiteNav = (): ReactElement => {
  const authState = useAuthState();
  return (
    <>
      {typeof authState.studentId !== 'undefined' && <StudentNav />}
      {typeof authState.tutorId !== 'undefined' && <TutorNav />}
      {typeof authState.administratorId !== 'undefined' && <AdministratorNav />}
    </>
  );
};
