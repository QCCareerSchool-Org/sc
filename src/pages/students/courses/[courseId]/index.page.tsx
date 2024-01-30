import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';
import { useEffect } from 'react';

import { CourseView } from './CourseView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

type Props = {
  courseId: number | null;
};

const CourseViewPage: NextPage<Props> = ({ courseId }) => {
  const authState = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'student', index: 0 } });
  }, [ navDispatch ]);

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Course View" />
      <CourseView studentId={authState.studentId} courseId={courseId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { courseId } };
};

export default CourseViewPage;
