import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUnitView } from '@/components/students/NewUnitView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  unitId: string | null;
};

const UnitViewPage: NextPage<Props> = ({ unitId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <Error statusCode={500} />;
  }

  if (!unitId) {
    return <Error statusCode={400} />;
  }

  return <NewUnitView studentId={authState.studentId} unitId={unitId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitIdParam = ctx.params?.unitId;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  return { props: { unitId } };
};

export default UnitViewPage;
