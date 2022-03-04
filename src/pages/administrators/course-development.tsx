import { NextPage } from 'next';
import Error from 'next/error';

import { CourseDevelopmentOverview } from '@/components/administrators/CourseDevelopmentOverview';
import { useAuthState } from '@/hooks/useAuthState';

const CourseDevelopmentPage: NextPage = () => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  return <CourseDevelopmentOverview administratorId={authState.administratorId} />;
};

export default CourseDevelopmentPage;
