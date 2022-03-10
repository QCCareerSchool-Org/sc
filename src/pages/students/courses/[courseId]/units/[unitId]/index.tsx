import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUnitView } from '@/components/students/NewUnitView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  unitId: string | null;
};

const NewUnitViewPage: NextPage<Props> = ({ courseId, unitId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <Error statusCode={500} />;
  }

  if (courseId === null || !unitId) {
    return <Error statusCode={400} />;
  }

  return <NewUnitView studentId={authState.studentId} courseId={courseId} unitId={unitId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { courseId, unitId } };
};

export default NewUnitViewPage;
