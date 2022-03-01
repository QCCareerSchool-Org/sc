import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

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
    return <Error statusCode={500} />;
  }

  if (courseId === null || !unitId || !assignmentId) {
    return <Error statusCode={400} />;
  }

  return <NewAssignmentView
    studentId={authState.studentId}
    courseId={courseId}
    unitId={unitId}
    assignmentId={assignmentId}
  />;
};

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
