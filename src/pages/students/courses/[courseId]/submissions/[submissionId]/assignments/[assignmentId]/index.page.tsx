import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewAssignmentView } from './NewAssignmentView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  submissionId: string | null;
  assignmentId: string | null;
};

const NewAssignmentViewPage: NextPage<Props> = ({ courseId, submissionId, assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || !submissionId || !assignmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Assignment View" />
      <NewAssignmentView
        studentId={authState.studentId}
        courseId={courseId}
        submissionId={submissionId}
        assignmentId={assignmentId}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const submissionIdParam = ctx.params?.submissionId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const submissionId = typeof submissionIdParam === 'string' ? submissionIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { courseId, submissionId, assignmentId } };
};

export default NewAssignmentViewPage;
