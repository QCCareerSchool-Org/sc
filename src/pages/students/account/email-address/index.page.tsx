import type { NextPage } from 'next';
import ErrorPage from 'next/error';

import { EmailAddressEdit } from './EmailAddressEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const EmailAddressPage: NextPage = () => {
  const { studentId, crmId } = useAuthState();

  if (typeof studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <Meta title="Change Email Address" />
      <EmailAddressEdit studentId={studentId} crmId={crmId} />
    </>
  );
};

export default EmailAddressPage;
