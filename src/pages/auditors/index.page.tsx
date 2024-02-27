import type { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useEffect } from 'react';

import { AuditorHome } from './home';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const AuditorHomePage: NextPage = () => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 0 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return <AuditorHome auditorId={auditorId} />;
};

export default AuditorHomePage;
