import type { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useEffect } from 'react';

import { StudentList } from './StudentList';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const AuditorStudenListPage: NextPage = () => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 1 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return <StudentList auditorId={auditorId} />;
};

export default AuditorStudenListPage;
