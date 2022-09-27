import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { NewAssignmentView } from '@/components/students/NewAssignmentView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
};

const NewAssignmentViewPage: NextPage<Props> = ({ courseId, unitId, assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || !unitId || !assignmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Assignment View" />
      <NewAssignmentView
        studentId={authState.studentId}
        courseId={courseId}
        unitId={unitId}
        assignmentId={assignmentId}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { courseId, unitId, assignmentId } };
};

export default NewAssignmentViewPage;
