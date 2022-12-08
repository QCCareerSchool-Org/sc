import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { CourseIndex } from '@/components/students/CourseIndex';
import { useAuthState } from '@/hooks/useAuthState';

const CourseIndexPage: NextPage = () => {
  const authState = useAuthState();

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
