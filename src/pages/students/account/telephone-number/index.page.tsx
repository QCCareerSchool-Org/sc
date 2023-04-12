import type { NextPage } from 'next';

import { TelephoneNumberEdit } from './TelephoneNumberEdit';
import { DatabaseLinkError } from '@/components/DatabaseLinkError';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

const TelephoneNumberPage: NextPage = () => {
  const { crmId } = useAuthState();

  if (typeof crmId === 'undefined') {
    return <DatabaseLinkError />;
  }

  return (
    <>
      <Meta title="Change Telephone Number" />
      <TelephoneNumberEdit crmId={crmId} />
    </>
  );
};

export default TelephoneNumberPage;
