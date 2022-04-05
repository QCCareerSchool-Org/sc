import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewAssignmentMediumEdit } from '@/components/administrators/NewAssignmentMediumEdit';
import { Meta } from '@/components/Meta';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
  mediumId: string | null;
};

const NewAssignmentMediumEditPage: NextPage<Props> = ({ schoolId, courseId, unitId, assignmentId, mediumId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null || !unitId || !assignmentId || !mediumId) {
    return <Error statusCode={400} />;
  }

  return (
    <>
      <Meta title="Assignment Media View" />
      <NewAssignmentMediumEdit
        administratorId={authState.administratorId}
        schoolId={schoolId}
        courseId={courseId}
        unitId={unitId}
        assignmentId={assignmentId}
        mediumId={mediumId}
      />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const mediumIdParam = ctx.params?.mediumId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  const mediumId = typeof mediumIdParam === 'string' ? mediumIdParam : null;
  return { props: { schoolId, courseId, unitId, assignmentId, mediumId } };
};

export default NewAssignmentMediumEditPage;
