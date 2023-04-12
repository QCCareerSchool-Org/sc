import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewSubmissionView } from './NewSubmissionView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  studentId: number | null;
  courseId: number | null;
  submissionId: string | null;
};

const NewSubmissionViewPage: NextPage<Props> = ({ studentId, courseId, submissionId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.tutorId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (studentId === null || courseId === null || !submissionId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit View" />
      <NewSubmissionView tutorId={authState.tutorId} studentId={studentId} courseId={courseId} submissionId={submissionId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const submissionIdParam = ctx.params?.submissionId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const submissionId = typeof submissionIdParam === 'string' ? submissionIdParam : null;
  return { props: { studentId, courseId, submissionId } };
};

export default NewSubmissionViewPage;
