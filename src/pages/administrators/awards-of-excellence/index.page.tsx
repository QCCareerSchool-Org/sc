import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { AwardsOfExcellence } from './awardsOfExcellence';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const AwardsOfExcellencePage: NextPage = () => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return (
    <>
      <Meta title="Awards of Excellence" />
      <AwardsOfExcellence administratorId={authState.administratorId} />
    </>
  );
};

export default AwardsOfExcellencePage;
