import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { NewUnitView } from '@/components/students/NewUnitView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  unitId: string | null;
};

const NewUnitViewPage: NextPage<Props> = ({ courseId, unitId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || !unitId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit View" />
      <NewUnitView studentId={authState.studentId} courseId={courseId} unitId={unitId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { courseId, unitId } };
};

export default NewUnitViewPage;
