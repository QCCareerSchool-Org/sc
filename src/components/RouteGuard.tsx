import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import type { AuthState } from '../state/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';

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

export const RouteGuard: FC<Props> = ({ children }) => {
  const authState = useAuthState();
  const navigateToLogin = useNavigateToLogin();
  const router = useRouter();
  const [ client, setClient ] = useState(false);

  useEffect(() => setClient(true), []);

  const valid = client
    ? validPath(router.asPath, authState)
    : undefined;

  useEffect(() => {
    if (valid === false) {
      navigateToLogin();
    }
  }, [ valid, navigateToLogin ]);

  if (valid) {
    return <>{children}</>;
  }

  return null;
};
