import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { SchoolView } from '@/components/administrators/SchoolView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
};

const SchoolViewPage: NextPage<Props> = ({ schoolId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  if (schoolId === null) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="School View" />
      <SchoolView administratorId={authState.administratorId} schoolId={schoolId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  return { props: { schoolId } };
};

export default SchoolViewPage;
