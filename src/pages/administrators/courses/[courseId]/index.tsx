import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { CourseView } from '@/components/administrators/CourseView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
};

const CourseViewPage: NextPage<Props> = ({ courseId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (courseId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Course View" />
      <CourseView administratorId={authState.administratorId} courseId={courseId} />
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
