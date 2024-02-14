import type { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { EnrollmentView } from './EnrollmentView';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

type Props = {
  studentId: number | null;
  courseId: number | null;
};

const AuditorEnrollmentPage: NextPage<Props> = ({ studentId, courseId }) => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 1 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined' || studentId === null || courseId === null) {
    return null;
  }

  return <EnrollmentView auditorId={auditorId} studentId={studentId} courseId={courseId} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  return { props: { studentId, courseId } };
};

export default AuditorEnrollmentPage;
