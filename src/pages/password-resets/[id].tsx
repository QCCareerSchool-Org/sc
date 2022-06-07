import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { UsePasswordResetRequest } from '@/components/passwordResets/UsePasswordResetRequest';

type Props = {
  id: number | null;
  code: string | null;
};

const UsePasswordResetPage: NextPage<Props> = ({ id, code }) => {

  if (id === null || code === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Set a New Password" />
      <UsePasswordResetRequest id={id} code={code} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const idParam = ctx.params?.id;
  const codeQuery = ctx.query?.code;
  const id = typeof idParam === 'string' ? parseInt(idParam, 10) : null;
  const code = typeof codeQuery === 'string' ? codeQuery : null;
  return { props: { id, code } };
};

export default UsePasswordResetPage;
