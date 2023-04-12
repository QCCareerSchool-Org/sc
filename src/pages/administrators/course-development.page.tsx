import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { CourseDevelopmentOverview } from '@/components/administrators/CourseDevelopmentOverview';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const CourseDevelopmentPage: NextPage = () => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return (
    <>
      <Meta title="Course Development" />
      <CourseDevelopmentOverview administratorId={authState.administratorId} />
    </>
  );
};

export default CourseDevelopmentPage;
