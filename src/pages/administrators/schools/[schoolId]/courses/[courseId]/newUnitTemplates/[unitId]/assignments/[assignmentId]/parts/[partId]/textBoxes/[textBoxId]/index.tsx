import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewTextBoxTemplateEdit } from '@/components/administrators/NewTextBoxTemplateEdit';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
  partId: string | null;
  textBoxId: string | null;
};

const NewTextBoxTemplateEditPage: NextPage<Props> = ({ schoolId, courseId, unitId, assignmentId, partId, textBoxId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null || !unitId || !assignmentId || !partId || !textBoxId) {
    return <Error statusCode={400} />;
  }

  return <NewTextBoxTemplateEdit
    administratorId={authState.administratorId}
    schoolId={schoolId}
    courseId={courseId}
    unitId={unitId}
    assignmentId={assignmentId}
    partId={partId}
    textBoxId={textBoxId}
  />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const partIdParam = ctx.params?.partId;
  const textBoxIdParam = ctx.params?.textBoxId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  const partId = typeof partIdParam === 'string' ? partIdParam : null;
  const textBoxId = typeof textBoxIdParam === 'string' ? textBoxIdParam : null;
  return { props: { schoolId, courseId, unitId, assignmentId, partId, textBoxId } };
};

export default NewTextBoxTemplateEditPage;
