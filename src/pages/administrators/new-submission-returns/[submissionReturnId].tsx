import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewSubmissionReturnView } from '@/components/administrators/NewSubmissionReturnView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  submissionReturnId: string | null;
};

const NewUnitReturnViewPage: NextPage<Props> = ({ submissionReturnId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!submissionReturnId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Returned Unit" />
      <NewSubmissionReturnView administratorId={authState.administratorId} submissionReturnId={submissionReturnId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const submissionReturnIdParam = ctx.params?.unitReturnId;
  const submissionReturnId = typeof submissionReturnIdParam === 'string' ? submissionReturnIdParam : null;
  return { props: { submissionReturnId } };
};

export default NewUnitReturnViewPage;
