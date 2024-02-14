import type { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { StudentView } from './StudentView';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

type Props = {
  studentId: number | null;
};

const AuditorStudentViewPage: NextPage<Props> = ({ studentId }) => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 1 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined' || studentId === null) {
    return null;
  }

  return <StudentView auditorId={auditorId} studentId={studentId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  return { props: { studentId } };
};

export default AuditorStudentViewPage;
