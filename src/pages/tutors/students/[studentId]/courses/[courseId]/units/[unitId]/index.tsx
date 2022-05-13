import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { NewUnitView } from '@/components/tutors/NewUnitView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  studentId: number | null;
  courseId: number | null;
  unitId: string | null;
};

const NewUnitViewPage: NextPage<Props> = ({ studentId, courseId, unitId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.tutorId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (studentId === null || courseId === null || !unitId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit View" />
      <NewUnitView tutorId={authState.tutorId} studentId={studentId} courseId={courseId} unitId={unitId} />
    </>
  );
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
