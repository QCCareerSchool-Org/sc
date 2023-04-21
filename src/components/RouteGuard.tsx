import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavigateToLogin } from '@/hooks/useNavigateToLogin';
import type { AuthState } from '@/state/auth';

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
  const [ isClient, setIsClient ] = useState(false);

  useEffect(() => setIsClient(true), []);

  // we don't have any auth state in SSR, so only calculate validity if isClient is true
  const valid = isClient
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
