import type { NextPage } from 'next';
import { useEffect } from 'react';

import { ChangePassword } from './ChangePassword';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const AuditorChangePasswordPage: NextPage = () => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 2 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined') {
    return null;
  }

  return <ChangePassword auditorId={auditorId} />;
};

export default AuditorChangePasswordPage;
