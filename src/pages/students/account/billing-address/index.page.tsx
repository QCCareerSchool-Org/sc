import type { NextPage } from 'next';

import { BillingAddressEdit } from './BillingAddressEdit';
import { Meta } from '@/components/Meta';
import { DatabaseLinkError } from '@/components/students/DatabaseLinkError';
import { useAuthState } from '@/hooks/useAuthState';

const BillingAddressPage: NextPage = () => {
  const { crmId } = useAuthState();

  if (typeof crmId === 'undefined') {
    return <DatabaseLinkError />;
  }

  return (
    <>
      <Meta title="Change Billing Address" />
      <BillingAddressEdit crmId={crmId} />
    </>
  );
};

export default BillingAddressPage;
