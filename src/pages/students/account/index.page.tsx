import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { AccountView } from './AccountView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const AccountPage: NextPage = () => {
  const { studentId, crmId } = useAuthState();

  if (typeof studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <Meta title="Account" />
      <AccountView studentId={studentId} crmId={crmId} />
    </>
  );
};

export default AccountPage;
