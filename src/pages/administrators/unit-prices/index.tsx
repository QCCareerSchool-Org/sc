import ErrorPage from 'next/error';
import type { ReactElement } from 'react';

import { UnitPrice } from '@/components/administrators/UnitPrice';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const UnitPricePage = (): ReactElement => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return (
    <>
      <Meta title="Unit Prices" />
      <UnitPrice administratorId={authState.administratorId} />
    </>
  );
};

export default UnitPricePage;
