import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewAssignmentView } from '@/components/administrators/NewAssignmentView';
import { NewSubmissionView } from '@/components/administrators/NewSubmissionView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  assignmentId: string | null;
};

const NewAssignmentViewPage: NextPage<Props> = ({ assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!assignmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="View Submission" />
      <NewAssignmentView administratorId={authState.administratorId} assignmentId={assignmentId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const assignmentIdParam = ctx.params?.assignmentId;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { assignmentId } };
};

export default NewAssignmentViewPage;
