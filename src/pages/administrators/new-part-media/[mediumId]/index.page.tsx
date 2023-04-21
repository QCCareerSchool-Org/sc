import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewPartMediumEdit } from '@/components/administrators/NewPartMediumEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  mediumId: string | null;
};

const NewPartMediumEditPage: NextPage<Props> = ({ mediumId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!mediumId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Part Media" />
      <NewPartMediumEdit administratorId={authState.administratorId} mediumId={mediumId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const mediumIdParam = ctx.params?.mediumId;
  const mediumId = typeof mediumIdParam === 'string' ? mediumIdParam : null;
  return { props: { mediumId } };
};

export default NewPartMediumEditPage;
