import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { CourseView } from '@/components/students/CourseView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
};

const CourseViewPage: NextPage<Props> = ({ courseId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <Error statusCode={500} />;
  }

  if (courseId === null) {
    return <Error statusCode={400} />;
  }

  return <CourseView studentId={authState.studentId} courseId={courseId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { courseId } };
};

export default CourseViewPage;
