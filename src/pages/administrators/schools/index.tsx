import { NextPage } from 'next';
import Error from 'next/error';

import { SchoolList } from '@/components/administrators/SchoolList';
import { useAuthState } from '@/hooks/useAuthState';

const SchoolListPage: NextPage = () => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  return <SchoolList administratorId={authState.administratorId} />;
};

export default SchoolListPage;
