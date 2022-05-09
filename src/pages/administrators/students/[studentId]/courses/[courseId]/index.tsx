import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

type Props = {
  studentId: number | null;
  courseId: number | null;
};

const NewUnitListPage: NextPage<Props> = ({ studentId, courseId }) => {
  if (studentId === null || courseId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return null;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { studentId, courseId } };
};

export default NewUnitListPage;
