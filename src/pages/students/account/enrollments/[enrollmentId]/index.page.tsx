import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { CourseAccountDetailsView } from './CourseAccountDetailsView';
import { DatabaseLinkError } from '@/components/DatabaseLinkError';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  crmEnrollmentId: number | null;
};

const CourseAccountDetailsPage: NextPage<Props> = ({ crmEnrollmentId }) => {
  const { crmId } = useAuthState();

  if (typeof crmId === 'undefined') {
    return <DatabaseLinkError />;
  }

  if (!crmEnrollmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Course Account Details" />
      <CourseAccountDetailsView crmId={crmId} crmEnrollmentId={crmEnrollmentId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const enrollmentIdParam = ctx.params?.enrollmentId;
  const enrollmentId = typeof enrollmentIdParam === 'string' ? parseInt(enrollmentIdParam, 10) : null;
  return { props: { crmEnrollmentId: enrollmentId } };
};

export default CourseAccountDetailsPage;
