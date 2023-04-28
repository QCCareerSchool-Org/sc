import type { GetServerSideProps, NextPage } from 'next';
import ErrorPage from 'next/error';

import { NewAssignmentView } from './NewAssignmentView';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  studentId: number | null;
  courseId: number | null;
  submissionId: string | null;
  assignmentId: string | null;
};

const NewAssignmentViewPage: NextPage<Props> = ({ studentId, courseId, submissionId, assignmentId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.tutorId === 'undefined') {
    return <ErrorPage statusCode={500} />;
  }

  if (studentId === null || courseId === null || !submissionId || !assignmentId) {
    return <ErrorPage statusCode={400} />;
  }

  return (
    <>
      <Meta title="Assignment View" />
      <NewAssignmentView
        tutorId={authState.tutorId}
        studentId={studentId}
        courseId={courseId}
        submissionId={submissionId}
        assignmentId={assignmentId}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const submissionIdParam = ctx.params?.submissionId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const submissionId = typeof submissionIdParam === 'string' ? submissionIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { studentId, courseId, submissionId, assignmentId } };
};

export default NewAssignmentViewPage;
