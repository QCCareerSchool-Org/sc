import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { useEffect } from 'react';
import { Meta } from '@/components/Meta';
import { CourseIndex } from '@/components/students/CourseIndex';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const CourseIndexPage: NextPage = () => {
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
      <Meta title="Courses" />
      <CourseIndex studentId={authState.studentId} />
    </>
  );

};

export default CourseIndexPage;
