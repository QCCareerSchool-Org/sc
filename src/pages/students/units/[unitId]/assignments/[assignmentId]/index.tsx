import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewAssignmentView } from '@/components/students/NewAssignmentView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  unitId: string | null;
  assignmentId: string | null;
};

const AssignmentViewPage: NextPage<Props> = ({ unitId, assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <Error statusCode={500} />;
  }

  if (!unitId || !assignmentId) {
    return <Error statusCode={400} />;
  }

  return <NewAssignmentView
    studentId={authState.studentId}
    unitId={unitId}
    assignmentId={assignmentId}
  />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { unitId, assignmentId } };
};

export default AssignmentViewPage;
