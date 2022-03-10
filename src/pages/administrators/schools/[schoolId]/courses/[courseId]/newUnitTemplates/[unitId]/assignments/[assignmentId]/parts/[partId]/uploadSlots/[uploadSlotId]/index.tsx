import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';

import { NewUploadSlotTemplateEdit } from '@/components/administrators/NewUploadSlotTemplateEdit';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  schoolId: number | null;
  courseId: number | null;
  unitId: string | null;
  assignmentId: string | null;
  partId: string | null;
  uploadSlotId: string | null;
};

const NewTextBoxTemplateEditPage: NextPage<Props> = ({ schoolId, courseId, unitId, assignmentId, partId, uploadSlotId }) => {
  const authState = useAuthState();

  if (typeof authState.administratorId === 'undefined') {
    return <Error statusCode={403} />;
  }

  if (schoolId === null || courseId === null || !unitId || !assignmentId || !partId || !uploadSlotId) {
    return <Error statusCode={400} />;
  }

  return <NewUploadSlotTemplateEdit
    administratorId={authState.administratorId}
    schoolId={schoolId}
    courseId={courseId}
    unitId={unitId}
    assignmentId={assignmentId}
    partId={partId}
    uploadSlotId={uploadSlotId}
  />;
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schoolIdParam = ctx.params?.schoolId;
  const courseIdParam = ctx.params?.courseId;
  const unitIdParam = ctx.params?.unitId;
  const assignmentIdParam = ctx.params?.assignmentId;
  const partIdParam = ctx.params?.partId;
  const uploadSlotIdParam = ctx.params?.uploadSlotId;
  const schoolId = typeof schoolIdParam === 'string' ? parseInt(schoolIdParam, 10) : null;
  const courseId = typeof courseIdParam === 'string' ? parseInt(courseIdParam, 10) : null;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  const assignmentId = typeof assignmentIdParam === 'string' ? assignmentIdParam : null;
  const partId = typeof partIdParam === 'string' ? partIdParam : null;
  const uploadSlotId = typeof uploadSlotIdParam === 'string' ? uploadSlotIdParam : null;
  return { props: { schoolId, courseId, unitId, assignmentId, partId, uploadSlotId } };
};

export default NewTextBoxTemplateEditPage;
