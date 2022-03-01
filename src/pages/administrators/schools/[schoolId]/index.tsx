import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { SchoolView } from '@/components/administrators/SchoolView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
};

const SchoolViewPage: NextPage<Props> = ({ schoolId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null) {
    return <Error statusCode={400} />;
  }

  return <SchoolView administratorId={authState.administratorId} schoolId={schoolId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  return { props: { schoolId } };
};

export default SchoolViewPage;
