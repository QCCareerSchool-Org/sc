import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewAssignmentView } from '@/components/tutors/NewAssignmentView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  studentId: number | null;
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
};

const NewAssignmentViewPage: NextPage<Props> = ({ studentId, courseId, unitId, assignmentId }: Props) => {
  const authState = useAuthState();

  if (typeof authState.tutorId === 'undefined') {
    return <Error statusCode={500} />;
  }

  if (studentId === null || courseId === null || !unitId || !assignmentId) {
    return <Error statusCode={400} />;
  }

  return <NewAssignmentView tutorId={authState.tutorId} studentId={studentId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} />;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const studentIdParam = ctx.params?.studentId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const studentId = typeof studentIdParam === 'string' ? parseInt(studentIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { studentId, courseId, unitId, assignmentId } };
};

export default NewAssignmentViewPage;
