import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewMaterialEdit } from '@/components/administrators/NewMaterialEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  materialUnitId: string | null;
  materialId: string | null;
};

const NewUnitTemplateEditPage: NextPage<Props> = ({ materialUnitId, materialId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!materialUnitId || !materialId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Edit Material" />
      <NewMaterialEdit administratorId={authState.administratorId} materialUnitId={materialUnitId} materialId={materialId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const materialUnitIdParam = ctx.params?.materialUnitId;
  const materialIdParam = ctx.params?.materialId;
  const materialUnitId = typeof materialUnitIdParam === 'string' ? materialUnitIdParam : null;
  const materialId = typeof materialIdParam === 'string' ? materialIdParam : null;
  return { props: { materialUnitId, materialId } };
};

export default NewUnitTemplateEditPage;
