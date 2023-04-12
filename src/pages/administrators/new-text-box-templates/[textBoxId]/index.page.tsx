import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewTextBoxTemplateEdit } from '@/components/administrators/NewTextBoxTemplateEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  textBoxId: string | null;
};

const NewTextBoxTemplateEditPage: NextPage<Props> = ({ textBoxId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!textBoxId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Text Box Template" />
      <NewTextBoxTemplateEdit administratorId={authState.administratorId} textBoxId={textBoxId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const textBoxIdParam = ctx.params?.textBoxId;
  const textBoxId = typeof textBoxIdParam === 'string' ? textBoxIdParam : null;
  return { props: { textBoxId } };
};

export default NewTextBoxTemplateEditPage;
