import { ReactElement } from 'react';
import { useAuthState } from '../../hooks/useAuthState';
import { AdministratorNav } from './AdministratorNav';
import { StudentNav } from './StudentNav';
import { TutorNav } from './TutorNav';

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
