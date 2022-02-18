import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';

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

export const RouteGuard = ({ children }: Props): ReactElement => {
  const router = useRouter();
  const authState = useAuthState();

  const [ authorized, setAuthorized ] = useState(false);

  useEffect(() => {

    const authCheck = (url: string): void => {
      const path = url.split('?')[0];
      if (!validPath(path, authState)) {
        setAuthorized(false);
        void router.push({ pathname: `/login`, query: { returnUrl: router.asPath } });
      } else {
        setAuthorized(true);
      }
    };

    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = (): void => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

  }, [ router, authState ]);

  return <>{authorized && children}</>;
};
