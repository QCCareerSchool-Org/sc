import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect } from 'react';

import { useAuthState } from '../hooks/useAuthState';
import { AuthState } from '../state/auth';

type Props = {
  children: ReactNode;
};

const validPath = (path: string, authState: AuthState): boolean => {
  if (path.startsWith('/students') && typeof authState.studentId === 'undefined') {
    return false;
  }
  if (path.startsWith('/tutors') && typeof authState.tutorId === 'undefined') {
    return false;
  }
  if (path.startsWith('/administrator') && typeof authState.administratorId === 'undefined') {
    return false;
  }
  return true;
};

export const RouteGuard = ({ children }: Props): ReactElement | null => {
  const router = useRouter();
  const authState = useAuthState();

  useEffect(() => {
    if (!validPath(router.asPath, authState)) {
      void router.push('/login');
    }
  }, [ authState, router ]);

  if (validPath(router.asPath, authState)) {
    return <>{children}</>;
  }

  return null;
};
