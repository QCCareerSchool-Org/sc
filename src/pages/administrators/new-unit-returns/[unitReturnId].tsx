import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewUnitReturnView } from '@/components/administrators/NewUnitReturnView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  unitReturnId: string | null;
};

const NewUnitReturnViewPage: NextPage<Props> = ({ unitReturnId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!unitReturnId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Returned Unit" />
      <NewUnitReturnView administratorId={authState.administratorId} unitReturnId={unitReturnId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitReturnIdParam = ctx.params?.unitReturnId;
  const unitReturnId = typeof unitReturnIdParam === 'string' ? unitReturnIdParam : null;
  return { props: { unitReturnId } };
};

export default NewUnitReturnViewPage;
