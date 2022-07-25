import type { NextPage } from 'next';
import ErrorPage from 'next/error';
import Head from 'next/head';

import { Meta } from '@/components/Meta';
import { NewCard } from '@/components/students/NewCard';
import { useAuthState } from '@/hooks/useAuthState';

const CardPage: NextPage = () => {
  const { crmId } = useAuthState();

  if (typeof crmId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <Meta title="New Card" />
      <NewCard crmId={crmId} />
    </>
  );
};

export default CardPage;
