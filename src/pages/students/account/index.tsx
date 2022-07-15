import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { AccountView } from '@/components/students/AccountView';
import { useAuthState } from '@/hooks/useAuthState';

const AccountPage: NextPage = () => {
  const { crmId } = useAuthState();

  if (typeof crmId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <Meta title="Account" />
      <AccountView crmId={crmId} />
    </>
  );
};

export default AccountPage;
