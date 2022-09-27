import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { Meta } from '@/components/Meta';
import { NewSubmissionView } from '@/components/students/NewSubmissionView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  courseId: number | null;
  submissionId: string | null;
};

const NewSubmissionViewPage: NextPage<Props> = ({ courseId, submissionId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.studentId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (courseId === null || !submissionId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Unit View" />
      <NewSubmissionView studentId={authState.studentId} courseId={courseId} submissionId={submissionId} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const courseIdParam = ctx.params?.courseId;
  const submissionIdParam = ctx.params?.submissionId;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const submissionId = typeof submissionIdParam === 'string' ? submissionIdParam : null;
  return { props: { courseId, submissionId } };
};

export default NewSubmissionViewPage;
