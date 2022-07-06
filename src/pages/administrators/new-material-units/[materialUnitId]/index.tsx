import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewMaterialUnitEdit } from '@/components/administrators/NewMaterialUnitEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  materialUnitId: string | null;
};

const NewMaterialUnitEditPage: NextPage<Props> = ({ materialUnitId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!materialUnitId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Material Unit" />
      <NewMaterialUnitEdit administratorId={authState.administratorId} materialUnitId={materialUnitId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const materialUnitIdParam = ctx.params?.materialUnitId;
  const materialUnitId = typeof materialUnitIdParam === 'string' ? materialUnitIdParam : null;
  return { props: { materialUnitId } };
};

export default NewMaterialUnitEditPage;
