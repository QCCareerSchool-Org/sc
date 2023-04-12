import type { NextPage } from 'next';

import { Meta } from '@/components/Meta';
import { DatabaseLinkError } from '@/components/students/DatabaseLinkError';
import { TelephoneNumberEdit } from '@/components/students/TelephoneNumberEdit';
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
