import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUnitView } from '@/components/administrators/NewUnitView';

type Props = {
  studentId: number | null;
  courseId: number | null;
  unitId: string | null;
};

const NewUnitViewPage: NextPage<Props> = ({ studentId, courseId, unitId }) => {
  if (studentId === null || courseId === null || !unitId) {
    return <Error statusCode={400} />;
  }

  return <NewUnitView studentId={studentId} courseId={courseId} unitId={unitId} />;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { studentId, courseId, unitId } };
};

export default NewUnitViewPage;
