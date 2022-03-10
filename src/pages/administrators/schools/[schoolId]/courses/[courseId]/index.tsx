import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { CourseView } from '@/components/administrators/CourseView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
};

const CourseViewPage: NextPage<Props> = ({ schoolId, courseId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null) {
    return <Error statusCode={400} />;
  }

  return <CourseView administratorId={authState.administratorId} schoolId={schoolId} courseId={courseId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { schoolId, courseId } };
};

export default CourseViewPage;
