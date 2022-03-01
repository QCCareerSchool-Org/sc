import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUnitList } from '@/components/administrators/NewUnitList';

type Props = {
  studentId: number | null;
  courseId: number | null;
};

const NewUnitListPage: NextPage<Props> = ({ studentId, courseId }) => {
  if (studentId === null || courseId === null) {
    return <Error statusCode={400} />;
  }

  return <NewUnitList studentId={studentId} courseId={courseId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { studentId, courseId } };
};

export default NewUnitListPage;
