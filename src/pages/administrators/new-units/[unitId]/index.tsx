import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewUnitView } from '@/components/administrators/NewUnitView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  unitId: string | null;
};

const NewUnitViewPage: NextPage<Props> = ({ unitId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (!unitId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit View" />
      <NewUnitView administratorId={authState.administratorId} unitId={unitId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitIdParam = ctx.params?.unitId;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { unitId } };
};

export default NewUnitViewPage;
