import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';

import type { AuthState } from '../state/auth';
import { useAuthState } from '@/hooks/useAuthState';

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

  if (validPath(router.asPath, authState)) {
    return <>{children}</>;
  }

  return null;
};
