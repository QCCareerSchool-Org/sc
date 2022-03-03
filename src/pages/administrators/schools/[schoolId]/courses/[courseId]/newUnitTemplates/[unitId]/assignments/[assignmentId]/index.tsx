import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewAssignmentTemplateView } from '@/components/administrators/NewAssignmentTemplateView';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
};

const NewAssignmentTemplateViewPage: NextPage<Props> = ({ schoolId, courseId, unitId, assignmentId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null || !unitId || !assignmentId) {
    return <Error statusCode={400} />;
  }

  return <NewAssignmentTemplateView
    administratorId={authState.administratorId}
    schoolId={schoolId}
    courseId={courseId}
    unitId={unitId}
    assignmentId={assignmentId}
  />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  return { props: { schoolId, courseId, unitId, assignmentId } };
};

export default NewAssignmentTemplateViewPage;
