import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useNavigateToLogin = (): () => void => {
  const router = useRouter();
  return useCallback(() => {
    if (router.asPath.includes('login')) {
      void router.push({ pathname: '/login' });
    } else {
      void router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
    }
  }, [ router ]);
};
