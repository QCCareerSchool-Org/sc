import type { NextRouter } from 'next/router';

export const navigateToLogin = async (router: NextRouter): Promise<boolean> => {
  return router.push({ pathname: '/login', query: { returnUrl: router.asPath } }, undefined, { scroll: false });
};
