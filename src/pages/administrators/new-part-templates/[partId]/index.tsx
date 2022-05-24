import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewPartTemplateEdit } from '@/components/administrators/NewPartTemplateEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  partId: string | null;
};

const NewPartTemplateEditPage: NextPage<Props> = ({ partId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!partId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Part Template Edit" />
      <NewPartTemplateEdit administratorId={authState.administratorId} partId={partId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const partIdParam = ctx.params?.partId;
  const partId = typeof partIdParam === 'string' ? partIdParam : null;
  return { props: { partId } };
};

export default NewPartTemplateEditPage;
