import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewSubmissionView } from '@/components/administrators/NewSubmissionView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  submissionId: string | null;
};

const NewSubmissionViewPage: NextPage<Props> = ({ submissionId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!submissionId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="View Submission" />
      <NewSubmissionView administratorId={authState.administratorId} submissionId={submissionId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const submissionIdParam = ctx.params?.submissionId;
  const submissionId = typeof submissionIdParam === 'string' ? submissionIdParam : null;
  return { props: { submissionId } };
};

export default NewSubmissionViewPage;
