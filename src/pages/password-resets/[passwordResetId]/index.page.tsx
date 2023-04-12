import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { UsePasswordResetRequest } from '@/components/passwordResets/UsePasswordResetRequest';

type Props = {
  passwordResetId: number | null;
  code: string | null;
};

const UsePasswordResetPage: NextPage<Props> = ({ passwordResetId, code }) => {

  if (passwordResetId === null || code === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Set a New Password" />
      <UsePasswordResetRequest passwordResetId={passwordResetId} code={code} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const passwordResetIdParam = ctx.params?.passwordResetId;
  const codeQuery = ctx.query?.code;
  const passwordResetId = typeof passwordResetIdParam === 'string' ? parseInt(passwordResetIdParam, 10) : null;
  const code = typeof codeQuery === 'string' ? codeQuery : null;
  return { props: { passwordResetId, code } };
};

export default UsePasswordResetPage;
