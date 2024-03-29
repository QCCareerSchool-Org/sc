import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { MaterialEdit } from '@/components/administrators/MaterialEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  materialId: string | null;
};

const MaterialEditPage: NextPage<Props> = ({ materialId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!materialId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Material" />
      <MaterialEdit administratorId={authState.administratorId} materialId={materialId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const materialIdParam = ctx.params?.materialId;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { materialId } };
};

export default MaterialEditPage;
