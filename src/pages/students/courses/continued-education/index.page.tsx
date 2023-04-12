import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { useEffect } from 'react';
import { ContinuedEducation } from './ContinuedEducation';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const ContinuedEducationPage: NextPage = () => {
  const authState = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'student', index: 0 } });
  }, [ navDispatch ]);

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <Meta title="Continued Education" />
      <ContinuedEducation studentId={authState.studentId} />
    </>
  );

};

export default ContinuedEducationPage;
